import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { getAllMessages } from "@/database";
import { useState } from "react";
import axios from "axios";

export default function Channel({channelId, messages: initialMessages}) {

    const [userName, setUserName] = useState('')
    const [text, setText] = useState('')
    const [messages, setMessages] = useState(initialMessages)

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('submit', userName, text)
        // Send to the database (POST)

        const result = await axios.post(`/api/channels/${channelId}/messages`, {
            userName, text
        })
        const newMessage = result.data

        setMessages([...messages, newMessage])
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
                    <div>
                        <h1>Channel {channelId}</h1>
                    </div>
                    <Link href='/channels'>channel page</Link>
                    <ul>
                        {messages.map((message) => (
                            <div className={styles.card}>
                                <li key={message.id}>{message.text}</li>
                            </div>
                        ))}
                    </ul>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='Username...'/>
                        </div>
                        <div>
                            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder='Message...'/>
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

export async function getServerSideProps(context) {
    // This is always server side
    // From the server, we can connect to the database
    const channelId = context.query.channelId
    const messages = await getAllMessages(channelId)
    return {
        props: {
            channelId,
            messages: JSON.parse(JSON.stringify(messages))
        }
    }
}