import Head from 'next/head'
import Blogcard from "../components/Blogcard"

export default function Blog({postdata}) {
    const lineOfPosts = postdata
    return (
        <div>
          <Head>
            <title>GMARR | Blog</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>                
            <div className='flex justify-center mt-0 bg-gradient-to-r from-green-400 to-blue-500 py-8 sticky top-0 z-50'>
                <h1 className='md:text-3xl font-extrabold tracking-tight text-4xl md:text-[4rem] md:leading-[3.5rem] text-white'>Blog.</h1>
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-5">
                {lineOfPosts.map(({title, created_at, description, slug})=>
                    <Blogcard key={slug} title={title} date={created_at} subTitle={description} href={`/blog/${slug}`}/>
                )}
            </div>
        </div>
    )
}

export async function getStaticProps(){
    const cmspath = "https://strapi.legisladoresmx.fun/Posts"
    const posts = await fetch (`${cmspath}`).then(r=>r.json())

    return{
        props:{
            postdata:posts
        }
    }
}
