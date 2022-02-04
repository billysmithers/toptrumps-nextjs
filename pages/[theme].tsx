import { promises as fs } from 'fs'
import Head from 'next/head'
import Link from 'next/link'
import path from 'path'

export default function Theme({ theme }) {
    return (
        <div>
            <Head>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta
                    name="description"
                    content={`Play the classic Top Trumps card game! Choose a ${theme.name} game to play.`}
                />
                <title>Top Trumps</title>
            </Head>

            <main className="bg-gray-100 text-black font-mono">
                <div className="container mx-auto md:px-24 lg:px-52">
                    <a href="/" className="p-4 block">Themes</a>
                    <h1 className="text-center text-3xl m-10">{theme.name}</h1>

                    <h2 className="text-center text-2xl m-10">{`Please select a ${theme.name} game to play`}</h2>

                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                        {theme.games.map((game) => (
                            <div key={ game.key } className="max-w-xs m-4">
                                <div className="bg-yellow-300 shadow-xl rounded-lg py-3">
                                    <div className="p-2">
                                        <h4 className="text-center text-xl text-gray-900 font-medium leading-8">
                                            <Link
                                                href={`/${encodeURIComponent(theme.key)}/${encodeURIComponent(game.key)}/`}
                                            >{ game.name }</Link>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export async function getStaticProps({ params }) {
    const games = JSON.parse(await fs.readFile(path.join(process.cwd(), 'games.json'), 'utf8'))
    const theme = games.find((theme) => { return theme.key === params.theme })

    return {
        props: {
            theme
        },
    }
}

export async function getStaticPaths() {
    const paths = [];
    const games = JSON.parse(await fs.readFile(path.join(process.cwd(), 'games.json'), 'utf8'))

    games.map((theme) => (
        paths.push({
            params: {
                theme: theme.key,
            }
        })
    ));

    return { paths, fallback: false }
}
