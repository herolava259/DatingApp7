export interface FileResultModel{
    FileName: string,
    ContentType: string,
    Extension: string,
    ChildFiles: FileResultModel[]
}


var a = `
"FileName": "abc.pdf",
"ContentType": "application/pdf"
"Extension": "pdf"
"ChildFiles": null
`

