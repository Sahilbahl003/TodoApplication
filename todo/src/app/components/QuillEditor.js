"use client"

import { useEffect, useRef } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"

export default function QuillEditor({value,setValue}){

const editorRef = useRef(null)
const quillRef = useRef(null)

useEffect(()=>{

if(!quillRef.current){

quillRef.current = new Quill(editorRef.current,{
theme:"snow",
modules:{
toolbar:[
[{header:[1,2,3,false]}],
["bold","italic","underline"],
[{list:"ordered"},{list:"bullet"}],
["link"],
["clean"]
]
}
})

quillRef.current.on("text-change",()=>{
setValue(quillRef.current.root.innerHTML)
})

if(value){
quillRef.current.root.innerHTML = value
}

}

},[])

return(

<div className="bg-white">
<div ref={editorRef}/>
</div>

)
}
