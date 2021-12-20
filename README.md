
## 1. Linode

Para este proyecto voy a utilizar una VM de Linode. Ya que la generamos tomamos el IP y nos conectamos a la VM a través de VS Code. Yo utilizo un plugin llamado `Remote Explorer` para hacer esto.

## 2. Docker
Ya que tenemos acceso a nuestra VM, debemos de instalar Docker. Docker es nos ayuda a crear contendores para nuestras aplicaciones.

```shell
 sudo apt-get update
 sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

 sudo apt-get update
 sudo apt-get install docker-ce docker-ce-cli containerd.io

 sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose --version
```
## 4 Node

```shell
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install --global yarn
```

## 5 nextJS

```shell
npx create-next-app -e with-tailwindcss ejemplo-blog
```

### 5.1 Estilos de Markdown
[**Este**](https://github.com/sindresorhus/github-markdown-css) repo de Github contiene los archivos necesarios para agregarle estilo a un archivo de markdown. Especificamente para este ejemplo, utilice el archivo llamado `github-markdown.css`

Adicional, para agregar color a los bloques de código escritos con markdown (a lo que se le conoce como highlight syntax) utilizaremos la librería [**Prism**](https://prismjs.com/). Existen muchos paquetes que se basan en esta libería. Este proyecto, al ser de React, puede aprovecharse de esta librería: 

```shell
yarn add prismjs
```

Nuestro CMS regresa unn *string* de texto en formato *markdonw* para este sitio tenemos que tomar esta información y connvertirla en HTML. Para este proceos (que se le conoce como *parsing*), utilizaremos un paquete que se llama ´next-mdx-remote´  que esta basado en la popular librería de markdown [MDX](https://mdxjs.com/docs/getting-started/). 

Este es el paquete:

```shell
yarn add next-mdx-remote
````

#### 5.1.1 Agregar Prsim a nuestro archivo
En el archivo `_app.js` agregar lo siguiente

```js
//_app.js

import "prismjs/themes/prism.css";
```

### 5.2 Componentes
Esta es la estructura básica de archivos con la que estaremos trabajando en este proyecto.

```
+-- components
|   └-- Blogcard.js
└-- pages
|   └-- blog
|   |.  └-- [postid].js
|   |.  └-- markdown-styles.module.css
|   └-- index.js
|   └-- _app.js
```
Crearemos una carpeta que se llama `components`.

### 5.3 Creando archivos de forma dinámica
NextJS permite crear páginas de forma dinámica. En nuestro caso, vamos a tener todos los artículos de nuestro blog en un CMS, y vamos a generar una página por artículo.
En nuestra estructura de archivos, tenemos un archivo llamado `[postid].js` dentro de este archvio colocamos el siguiente código.

```js
//[postid].js
import markdownStyles from './markdown-styles.module.css'
import {serialize} from "next-mdx-remote/serialize"
import { MDXRemote } from "next-mdx-remote"
import { useEffect } from "react"

const prism = require("prismjs")
require("prismjs/components/prism-python")
require("prismjs/components/prism-bash")
require("prismjs/components/prism-json")

export default function Movies({results,source}) {

    useEffect(()=>{
        console.log("using effect");
        prism.highlightAll();
    },[])

    const blog = results[0]

    return (
        <div className="flex-col items-center justify-center min-h-screen mt-9">
            {/* Title */}
            <div className="flex-col items-center justify-start ml-11 md:ml-36 space-y-2">
                <h1 className="text-5xl font-bold">{blog["title"]}</h1>
            </div>
            <div className="flex-col items-center justify-start ml-11 md:ml-36 mt-2">
                <p className="text-sm font-extralight"><span className="font-normal">Fecha: </span> {blog["published_at"].slice(0,10)}</p>
                <p className="text-sm font-extralight"><span className="font-normal">Autor: </span> {blog["user"]["username"]}</p>
            </div>
            <div className="mx-11 md:mx-36 mt-8">
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
```
### 5.4 Landing Page
Nuestro Landing Pages desplegará unas tarjetas con los nombres de los artículos para que los usuarios puedan escoger que leer.

Este es un ejemplo del código que yo utilice en mi sitio,
```js
import Blogcard from "../components/Blogcard"

export default function Blog({postdata}) {
    const lineOfPosts = postdata
    return (
        <div>                
            <div className='flex justify-center mt-0 bg-gradient-to-r from-green-400 to-blue-500 py-16 sticky'>
                <h1 className='text-3xl font-extrabold tracking-tight sm:text-4xl md:text-[4rem] md:leading-[3.5rem] text-white'>Blog.</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 place-content-center place-items-center mx-3 mt-6 gap-3">
                {lineOfPosts.map(({title, created_at, description, slug})=>
                    <Blogcard key={slug} title={title} date={created_at} subTitle={description} href={`/tech/${slug}`}/>
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
```
### 5.5 `BlogCard` Component
Este componete lo diseñe para desplegar el contenido de las tarjetas que tengo en mi *Landing Page*.
Aquí un ejemplo del código
```js
import Link from "next/link"

export default function Blogcard({title,date,subTitle, href}) {

    return (
        <main className="w-full flex justify-center">
            <div className="p-3 space-y-2 rounded-lg border border-gray-400 bg-white shadow-md">
                <section className="text-sm font-thin text-orange-400 text-gray-400">
                    Published On:&nbsp;
                    {date}
                </section>
                <section className="text-3xl font-bold text-black pb-2">
                    {title}
                </section>
                <section className="font-normal text-md text-gray-700">
                    {subTitle}
                </section>
                <section className="flex justify-end">
                    <Link href={href}>
                        <a>
                            <button type="button" className="bg-gray-600 text-white px-3 py-1 rounded-md">Read more</button>
                        </a>
                    </Link>
                </section>
            </div>
        </main>
    )
}
```

## 6 Build Container
Crear una imagen de Docker con el código recomendado por [Vercel](https://nextjs.org/docs/deployment). Este código irá en un `Dockerfile` en el root folder de nuestro proyecto.

El siguiente paso es generar nuestro contenedor y activarlo

```shell
docker build . -t my-next-js-app
docker run -p 3000:3000 my-next-js-app
```
Una vez que corra todo el proceso, nuestra aplicación estará lista y corriendo en nuestra VM.

## 7 NGINX  - Reverse Proxy
Un *reverse proxy* se usa para muchas cosas. En nuestro caso particular, al tener corriendo nuestro proyecto en un Docker contatiner, podemos tener la flexibilidad de tomar el tráfico que llega a nuestra IP  y manndarlo a nuestro contenedor. 

### 7.1 Install NGINX on the VM

```bash
apt install nginx
systemctl status nginx
```

### 7.2 Re-arrange the proxy files 
Dentro de la VM visitar `/etc/nginx/sites-enabled ` y agregar el siguiente código

```shell
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        server_name blog.gerardom.xyz ;

        location / {
                proxy_pass http://0.0.0.0:3000;
		proxy_set_header HOST $host;
        }
}
```

```shell
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d blog.gerardom.xyz
certbot renew --dry-run
```

Esta es la configuración básica para crear el tunel. El proxy funciona de la siguiente forma. El usuario solicita nuestra URL. El proxy recibe esta señal y la re-enruta a nuestro Docker Container.

Podemos tener varios contendores corriendo simultaneamente y re-enrutarlos todos con estos tuneles. Aqui un ejemplo de como agregaríamos un tunel adicional para una app de FastAPI, por ejemplo.

Dentro de  `/etc/nginx/sites-enabled ` agregar un file adicional con el nombre que quieras y colocar el siguiente código.

```bash
server{  
    listen 80;
    listen [::]:80;
    
    server_name twitch.gmarr.com;

	location / {
		proxy_pass http://0.0.0.0:6000;
		proxy_set_header HOST $host;
# These are the critical headers needed by uvicorn to honor HTTPS in url_for :
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
	}

}
```

Aquí algunos comandos adicionales para revisar nginx.

```shell
 lsof -i -P | grep LISTEN 
systemctl restart nginx
systemctl reload nginx
```
