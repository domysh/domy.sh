import Head from "next/head";
import Link from "next/link";
import spacerStyle from "./styles/Spacer.module.scss"
import { marked } from 'marked';
import sideLineStyle from "./styles/SideLine.module.scss"
import ReactMarkdown from "react-markdown";
import { InfosContext } from "./Context/Infos";
import { useContext, useState } from "react";
import { Category, PublicInfo } from "./interfaces";
import { EmojiRender } from "./EmojiRender"
import { fakeIcon } from "./Posts";

export const Spacer = () => {
    return <div className={spacerStyle.spacer} />
}

export const LoremIpsum = () => {return (<>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod augue orci, id lobortis arcu pellentesque quis. Nunc nec pellentesque tellus. Ut lorem mauris, vehicula at risus viverra, pharetra cursus eros. Sed iaculis elit suscipit, sagittis tellus id, laoreet turpis. In iaculis, ante in varius tempor, orci turpis malesuada turpis, et sollicitudin arcu arcu id ante. Nunc ut sapien velit. Nullam vitae elementum purus, quis viverra nisl. Donec placerat est eget mollis convallis. Cras rhoncus neque ipsum. Vivamus laoreet elit ut justo egestas posuere. Praesent ut purus commodo, ultrices risus maximus, efficitur turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut condimentum faucibus nunc, sed aliquam odio scelerisque eget.
    Mauris imperdiet scelerisque ullamcorper. Aliquam et sem nec arcu volutpat malesuada. Nunc vehicula leo porttitor sapien volutpat, sed condimentum erat ornare. Maecenas turpis velit, lacinia id purus a, dignissim tristique dui. Proin ultricies posuere semper. Praesent elementum velit ut diam blandit, mollis sollicitudin enim fringilla. Nulla lobortis augue sed neque iaculis, eu feugiat sem gravida. Integer eleifend urna eget mollis placerat. Proin dictum molestie lorem, eget consectetur augue congue a. Fusce erat est, ultricies et augue laoreet, ultrices tempus urna. Quisque sit amet urna non ligula sollicitudin blandit ut nec dui. Maecenas interdum odio ac dignissim condimentum. Phasellus nunc elit, pharetra at magna in, aliquet lacinia arcu. Ut finibus sed sem pretium vulputate. Nulla facilisi. Etiam mauris libero, scelerisque id neque at, ullamcorper maximus ante.
    Quisque eget ante at odio egestas tempus vitae nec quam. Vivamus neque odio, posuere in nunc nec, vestibulum elementum nibh. Nunc est tellus, commodo quis pharetra ac, aliquet vel mi. Donec maximus hendrerit leo id viverra. Maecenas vulputate, est vel mollis posuere, est lorem cursus risus, a fermentum nulla dolor vel felis. Donec sollicitudin tempor velit et dictum. Morbi congue lobortis risus at faucibus. Praesent ac ipsum nec turpis varius malesuada ac sit amet mi. In hac habitasse platea dictumst. Integer magna ipsum, congue vestibulum eros eget, elementum pulvinar diam. Curabitur ornare sem augue, vitae vulputate neque rhoncus at. Etiam vestibulum in neque at ornare.
    Mauris mollis rhoncus condimentum. Duis ultrices ante fringilla dictum porta. Nam luctus gravida metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at est quis nunc feugiat pharetra. Curabitur ut ornare nulla. Praesent ornare justo et pulvinar lobortis. Curabitur aliquam rhoncus libero, non vulputate sapien viverra eget. Pellentesque bibendum faucibus tortor, at laoreet arcu vehicula eu. Integer malesuada, metus ac maximus dapibus, mauris ante sollicitudin mauris, pellentesque facilisis risus justo in magna.
    Etiam convallis felis dolor, sed gravida leo ornare nec. Donec eget scelerisque nunc, quis semper libero. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus sed augue gravida, pulvinar libero ac, accumsan ligula. In interdum ipsum id ex tincidunt, id efficitur risus auctor. Cras vel sodales felis. Donec non mattis metus. Cras imperdiet posuere lacinia.
    Etiam consectetur eget ex et venenatis. Pellentesque ante nibh, rhoncus vel arcu et, consequat vestibulum erat. Nulla vitae tellus magna. Quisque sollicitudin nec leo sed interdum. In hendrerit nulla blandit est elementum, facilisis rutrum est bibendum. Suspendisse malesuada nulla enim, quis auctor urna pellentesque in. Aenean ante augue, placerat sed faucibus quis, maximus non mauris. Suspendisse commodo lectus non sapien euismod, vitae volutpat leo blandit. Suspendisse venenatis arcu ut nulla euismod cursus. Mauris pretium consectetur lacus, id pharetra eros consectetur in. Etiam porttitor, ante blandit rhoncus vulputate, nibh orci tempor nibh, et tincidunt ligula massa quis tellus. Pellentesque id feugiat nisl, non ultrices felis. Suspendisse luctus nec nisl eget posuere. Fusce ut dolor at libero vulputate finibus.
    Mauris nisl dolor, iaculis quis tortor nec, elementum blandit enim. Donec tempor massa et sapien malesuada, at interdum odio dictum. Nunc blandit scelerisque tortor, a auctor elit. Nulla in sem ut ex rhoncus tempus. Suspendisse condimentum placerat nulla, id fermentum orci efficitur vel. Phasellus lacinia tortor velit, in feugiat libero pharetra nec. Aenean viverra libero commodo ligula tincidunt semper. Integer elementum hendrerit augue et bibendum. Praesent pulvinar nec tortor eget ultrices. Proin imperdiet lobortis lectus interdum condimentum. Phasellus bibendum scelerisque ipsum nec elementum. Praesent quis porta odio. Praesent sed feugiat mauris. Curabitur augue ex, fermentum at convallis id, varius sit amet felis. Quisque sagittis nulla vel rhoncus aliquam. Morbi vel purus sed orci semper dictum eu eleifend tortor.
    Cras quam quam, sodales in sodales ut, ultrices sit amet leo. Suspendisse eget lorem arcu. Sed viverra placerat lacus sit amet tristique. Sed neque est, consequat eu gravida id, egestas vitae velit. Phasellus pharetra lacus lectus, at fringilla nunc suscipit quis. Aenean nec libero rutrum, iaculis odio nec, rhoncus diam. Praesent tempus nunc tellus, et auctor justo pellentesque non.
    Morbi varius rutrum volutpat. Donec et feugiat nunc, eu sodales purus. Vestibulum purus nulla, ultricies ac tortor et, varius mollis felis. Sed vel iaculis nunc. Proin nec velit tortor. Etiam iaculis risus vitae porta pharetra. Proin at lacus dignissim, rutrum leo ac, aliquam dolor. Aenean turpis nulla, feugiat ac cursus et, elementum sit amet felis. Nam gravida aliquam luctus. Cras nec nisi porta, maximus elit eget, placerat elit. In congue dui a ligula finibus varius. Sed iaculis ultrices mattis. Curabitur at elementum magna.
    Quisque quis dapibus libero. Cras congue in ex vitae fringilla. Nunc efficitur felis libero, at lacinia nisi sodales ut. Fusce nec neque velit. Nam scelerisque, arcu ut ultricies vulputate, erat nulla tristique odio, quis eleifend velit ante eget velit. Suspendisse potenti. Ut id lectus a erat pretium ullamcorper. Fusce dictum, lectus eu tempus suscipit, ex diam porta metus, ac finibus risus nibh consequat odio. Quisque at augue at elit pulvinar lacinia ac nec tellus.
    Duis ultrices tincidunt lacus. Phasellus ornare euismod urna, sit amet pharetra metus egestas ut. Nulla facilisi. Aenean luctus enim lorem, eu posuere tellus mattis sit amet. Nam hendrerit efficitur lacus eget imperdiet. Vivamus ante tellus, commodo eget arcu at, egestas laoreet augue. Vestibulum efficitur dui leo, at venenatis erat aliquam quis. Vivamus arcu sapien, varius vel auctor quis, ornare vitae ligula. Proin condimentum aliquam nulla rhoncus scelerisque. Sed eu est eget dui scelerisque finibus. Etiam id facilisis nisl, sit amet tempor risus.</>);}

export const getCategory = ( categoryCode:string ) => {
    return getCategoryWithInfos(categoryCode, useContext(InfosContext))
}

export const getCategoryWithInfos = (categoryCode:string, infos:PublicInfo) => {
    for (const ele of infos.categories)
        if (ele._id === categoryCode) return ele
    return fakeIcon
}

export const SideLine = ({ icon, color, category_id }:{ icon:string, color:string, category_id:string }) => {
    return <>
        <div className={sideLineStyle.linecontainer}>
            <div className={sideLineStyle.line} />
                <Link href={`/c/${category_id}`}>
                    <i className={`${icon} ${sideLineStyle.categoryicon}`} style={{color}} />
                </Link>
            <div className={sideLineStyle.line} />
        </div>
    </>
}

export const NoBots = () => {
    return <Head>
        <meta name="robots" content="noindex"></meta>
    </Head>
}


export const marktext_to_plain = (marktext:string) => {
    let htmlObject = document.createElement('div');
    htmlObject.innerHTML = marked.parse(marktext)
    return htmlObject.innerText
}

export const MdPost = ({ children }:{ children:any }) => <EmojiRender>
    <ReactMarkdown unwrapDisallowed disallowedElements={["p"]} >
        {children}
    </ReactMarkdown></EmojiRender>
