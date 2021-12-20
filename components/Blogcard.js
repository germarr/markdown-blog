import Link from "next/link"

export default function Blogcard({title,date,subTitle, href}) {
    let titleI = title
    let subTitleI = subTitle
    
    if(titleI.length > 18){
        titleI = `${title.slice(0,21)} ...`
    }
    
    if(subTitleI.length > 87){
        subTitleI = `${subTitle.slice(0,87)} ...`
    }

    return (
        <main className="w-full flex justify-center">
            <div className="p-3 space-y-2 rounded-lg border border-gray-400 bg-white shadow-md h-52 w-96">
                <section className="text-sm font-medium text-gray-400">
                    <span className="font-normal">Published On:&nbsp;</span>
                    {date.slice(0,10)}
                </section>
                <section className="text-3xl font-bold text-black pb-2">
                    {titleI}
                </section>
                <section className="font-normal text-md text-gray-700">
                    {subTitleI}
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