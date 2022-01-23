import { useEffect, useState } from "react"
import { Button, Col, Row } from "react-bootstrap"
import style from "./style.module.scss"

const searchOnList = (query:string, list:string[]) => {
    return list.filter( (v) => v.includes(query) )
}

export const IconPicker = ({ value, onChange, color }:{ value:string, onChange:(v:string)=>void, color?:string}) => {
    
    const [iconList, setIconList] = useState<string[]>([])
    const [page, setPage] = useState<number>(0)
    const icon_on_page = 4*4
    const [filteredList, setFilteredList] = useState<string[]>([])
    const [query,setQuery] = useState<string>("")

    useEffect(()=>{
        setFilteredList(searchOnList(query,iconList))
    },[query, iconList])

    const max_pages = Math.ceil(filteredList.length / icon_on_page)

    if (page >= max_pages)
        if (page===max_pages && page === 0){}
        else {setPage(max_pages===0?0:max_pages-1)}
    
    const showedList = filteredList.slice(page*icon_on_page,page*icon_on_page+icon_on_page)

    useEffect(()=>{(async ()=>{
        setIconList(await fetch("/fa-list.json").then(r => r.json()))
    })()},[])

    return <div className={style.icon_chooser_box}>
        <div className={style.pagecount} >
            {max_pages===0?0:page+1} / {max_pages}
        </div>
        <div className="center-flex">
            <input type="text" className={style.input} value={query} onChange={(v)=>{setQuery(v.target.value)}}/>
        </div>
        <div className="center-flex">
            <Row className={style.iconcollection}>
                {showedList.map((o,i)=>
                    <Col key={o+"_"+i} xs={3} className="g-0 center-flex">
                        <i style={color?{backgroundColor:color}:{}}className={`${o} ${style.icon_box}`} onClick={()=>{onChange(o)}} />
                    </Col>)}
            </Row>
        </div>
        <div className={style.footer}>
            <i className={`${value} ${style.selectedicon}`} />
            <div className="flex-fullwidth" />
            <div>
                <Button className={style.switchbtn} variant="secondary" onClick={()=>setPage(page-1)} disabled={page<=0}>
                    <i className="fas fa-angle-left" />
                </Button>
                <Button className={style.switchbtn} variant="secondary" onClick={()=>setPage(page+1)} disabled={max_pages === (max_pages===0?0:page+1)}>
                    <i className="fas fa-angle-right" />
                </Button>
            </div>
        </div>

    </div>
}