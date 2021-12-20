import markdownStyles from './markdown-styles.module.css'
import {serialize} from "next-mdx-remote/serialize"
import { MDXRemote } from "next-mdx-remote"
import { useEffect } from "react"
import Head from 'next/head'

const prism = require("prismjs")
require("prismjs/components/prism-python")
require("prismjs/components/prism-bash")
require("prismjs/components/prism-json")

export default function Movies({results,source}) {

    useEffect(()=>{
        prism.highlightAll();
    },[])

    const blog = results[0]

    return (
        <div className="flex-col items-center justify-center min-h-screen mt-9">
            <Head>
                <title>{blog["title"]}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>  
            {/* Title */}
            <div className="flex-col items-center justify-start ml-11 md:ml-36 space-y-2">
                <h1 className="text-5xl font-bold">{blog["title"]}</h1>
            </div>
            <div className="flex-col items-center justify-start ml-11 md:ml-36 mt-2">
                <p className="text-sm font-extralight"><span className="font-normal">Fecha: </span> {blog["published_at"].slice(0,10)}</p>
                <p className="text-sm font-extralight"><span className="font-normal">Autor: </span> {blog["user"]["username"]}</p>
            </div>
            <div className="mx-11 md:mx-36 my-8">
                <div className={markdownStyles["markdown-body"]}>
                    <MDXRemote {...source}/>
                </div>
            </div>
        </div>
    )
}


export async function getStaticProps({params}){
    const article_post = []
    
    const req = await fetch(`https://strapi.legisladoresmx.fun/posts`)
    const result = await req.json()
 

    result.forEach(element => {
        
        if(element["slug"] === params.postid){
            article_post.push(element)
        }
    });

    const source = article_post[0]["content"]
    const mdxSource = await serialize(source)
    
    return{
        props:{
            results:article_post,
            source:mdxSource
        },
        revalidate:3600
    }
}

export async function getStaticPaths(){
    const req = await fetch("https://strapi.legisladoresmx.fun/posts")
    const result = await req.json()
    
    return{
        paths: result.map(posts=>{
            return{
                params:{
                    postid:posts.slug
                }
            }
            }
        ),
        fallback:false
    }
}