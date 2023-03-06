import Head from 'next/head'
import styles from '@/styles/Channels.module.css'
import Link from 'next/link';
import { useState } from "react";
import axios from "axios";
import { getAllChannels } from "@/database";

function wait(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, seconds * 1000)
    })
}

export default function Channels({channels}) {

    //const [channels, setChannels] = useState([])

    // useEffect(() => {
    //     // Anything in useEffect will definitely run on the client
    //     // in the browser
    //     wait(5).then(() => axios.get("/api/channels")
    //     .then((response) => {
    //         setChannels(response.data)
    //     }))
    // }, [])
    // Get request to /api/channels
    // useState
    // useEffect

    const [name, setName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('submit', name)
        // Send to the database (POST)

        const result = await axios.post(`/api/channels`, {
            name
        })
        const newChannel = result.data

        setName([...channels, newChannel])
    }

    return (
        <>
            <Head>
            <title>Discord app</title>
            <meta name="description" content="This is a discord clone app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div>
                    <div >
                        <h1>Text Channels</h1>
                    </div>
                        <ul>
                            {channels.map((channel) => (
                                <div className={styles.card}>
                                   <Link href={`/channels/${channel.id}`}> <li key={channel.id}>   {channel.name}</li></Link>
                                </div>
                            ))}
                        </ul>
                        <form onSubmit={handleSubmit}>
                        <div>
                            <label>Create a new channel here</label><br/>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Channel name...'/>
                        </div>
                        <div> 
                            <button type="submit">Send</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export async function getServerSideProps() {

    // runs on the server
    const channels = await getAllChannels();

    return {
        props: {
            channels: JSON.parse(JSON.stringify(channels))
        }
    }

}