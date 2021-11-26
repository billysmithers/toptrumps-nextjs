import Fetchers from "../../types/api/";
import Transformers from "../../types/transformers/";
import {promises as fs} from "fs";
import path from "path";
import Head from "next/head";
import {CardBack} from "../../components/CardBack";

export default function Game({ gameName, cards, credits }) {
    return <div>
        <Head>
            <meta charSet="utf-8"></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            <meta name="description" content="Play the classic Top Trumps card game! This card set is based on {gameName}."></meta>
            <title>Top Trumps - {gameName}</title>
        </Head>

        <main className="bg-gray-100 font-mono text-black">
            <div className="container mx-auto md:px-24 lg:px-52">
                <a href="/" className="p-4 block">Games</a>
                <h1 className="text-center text-3xl m-10">{gameName}</h1>

                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    <div>
                        <h2 className="text-xl text-gray-900 font-medium leading-8">Player 1 (You)</h2>
                        <CardBack name={gameName}></CardBack>
                    </div>

                    <div>
                        <h2 className="text-xl text-gray-900 font-medium leading-8">Player 2 (Computer)</h2>
                        <CardBack name={gameName}></CardBack>
                    </div>
                </div>

                <footer className="text-center">{credits}</footer>
            </div>
        </main>
    </div>
}

export async function getStaticProps({ params }) {
    const games = JSON.parse(await fs.readFile(path.join(process.cwd(), 'games.json'), 'utf8'));
    const cards = [];

    const config = games.find((theme) => { return theme.key === params.theme }).games
      .find((game) => { return game.key === params.game });

    const fetcher = new Fetchers[config.fetcher]();
    const transformer = new Transformers[config.transformer]();
    const resources = await fetcher.fetch();

    resources.map((resource) => {
        cards.push(transformer.forCard(resource));
    })

    return {
        props: {
            gameName: config.name,
            cards,
            credits: config.credits
        },
    }
}

export async function getStaticPaths() {
    const paths = [];
    const games = JSON.parse(await fs.readFile(path.join(process.cwd(), 'games.json'), 'utf8'));

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
