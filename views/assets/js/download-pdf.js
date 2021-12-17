function download_pdf(){
    fetch('/download', {
        method: 'POST',
        body: 'My HTML String' // Would define object and stringify.
    })
    .then(res => res.text())
    .then(base64String => {
        const anchorTag = document.createElement('a');
        anchorTag.href = base64String;
        anchorTag.download = "My PDF File.pdf"; 
        anchorTag.click();
    });
}
    