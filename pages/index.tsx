import Head from 'next/head'
import { promises as fs } from 'fs'
import path from 'path'

export default function Home({ games }) {
    return (
        <div>
            <Head>
                <meta charSet="utf-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                <meta name="description" content="Play the classic Top Trumps card game! Choose a game to play from this page."></meta>
                <title>Top Trumps</title>
            </Head>

            <main className="bg-gray-100 text-black font-mono">
                <div className="container mx-auto md:px-24 lg:px-52">
                    <h1 className="text-center text-3xl m-10">Top Trumps</h1>

                    <h2 className="text-center text-2xl m-10">Please select a game from the themes below</h2>

                    {games.map((theme) => (
                        <div key={ theme.key }>
                            <h3 className="text-center text-xl m-10">{ theme.name }</h3>

                            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                                {theme.games.map((game) => (
                                    <div key={ game.key } className="max-w-xs m-4">
                                        <div className="bg-yellow-300 shadow-xl rounded-lg py-3">
                                            <div className="p-2">
                                                <h4 className="text-center text-xl text-gray-900 font-medium leading-8">
                                                    <a href={`${theme.key}/${game.key}/`}>{ game.name }</a>
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export async function getStaticProps() {
    const games = await fs.readFile(path.join(process.cwd(), 'games.json'), 'utf8');

    return {
        props: {
            games: JSON.parse(games),
        },
    }
}