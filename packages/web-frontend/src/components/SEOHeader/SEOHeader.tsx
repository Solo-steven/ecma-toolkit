import Head from "next/head";

interface SEOHeaderProps {
    title: string; 
    description: string;
}

export const SEOHeader = (props: SEOHeaderProps) => {
    return (
        <Head>
            <title>{props.title}</title>
            <meta name="description" content={props.description} />
        </Head>
    )
}