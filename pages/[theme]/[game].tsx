import Fetchers from "../../types/api/";
import Transformers from "../../types/transformers/";
import {promises as fs} from "fs";
import path from "path";
import dynamic from 'next/dynamic'
import Head from "next/head";

const GameEngine = dynamic(
    () => import("../../components/GameEngine"),
    { ssr: false }
)

export default function Game({ theme, gameName, cards, credits }) {
    return <div>
        <Head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta
                name="description"
                content={`Play the classic Top Trumps card game! This card set is based on ${gameName}.`}
            />
            <title>{`Top Trumps - ${theme.name} ${gameName}`}</title>
        </Head>

        <main className="bg-gray-100 font-mono text-black">
            <div className="container mx-auto md:px-24 lg:px-52">
                <div className="p-4 block">
                    <a href="/">Themes</a> / <a href={`/${encodeURIComponent(theme.key)}/`}>{theme.name}</a>
                </div>
                <h1 className="text-center text-3xl m-10">{gameName}</h1>
                <GameEngine cards={cards}/>
                <footer className="text-center mt-4">{credits}</footer>
            </div>
        </main>
    </div>
}

export async function getStaticProps({ params }) {
    const games = JSON.parse(await fs.readFile(path.join(process.cwd(), 'games.json'), 'utf8'))
    const cards = [];

    const theme = games.find((theme) => { return theme.key === params.theme })
    const config = theme.games.find((game) => { return game.key === params.game })

    const fetcher = new Fetchers[config.fetcher]()
    const transformer = new Transformers[config.transformer]()
    const resources = await fetcher.fetch()

    resources.map((resource) => {
        cards.push(transformer.forCard(resource))
    })

    return {
        props: {
            theme,
            gameName: config.name,
            cards,
            credits: config.credits
        },
    }
}

export async function getStaticPaths() {
    const paths = []
    const games = JSON.parse(await fs.readFile(path.join(process.cwd(), 'games.json'), 'utf8'))

    games.map((theme) => (
        theme.games.map((game) => (
            paths.push({
                params: {
                    theme: theme.key,
                    game: game.key,
                }
            })
        ))
    ));

    return { paths, fallback: false }
}
