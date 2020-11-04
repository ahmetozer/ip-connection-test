String.prototype.inikv = function (regxy) {
    const myRegexp = RegExp("^(?:"+regxy+")=(.*)$","gm");
    let match = myRegexp.exec(this);
    if (match != null) {
        return match[1]
    }
    return null
}

const ipVersions = [ "IPv4", "IPv6" ]
function copyFunction(elementName) {
    var copyText = document.getElementById(elementName);
    var textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999)
    document.execCommand("Copy");
    textArea.remove();
}

ipVersions.forEach(ipVersion => {
    $.ajax({
        url: 'https://'+siteConfig.testHosts[ipVersion]+'/cdn-cgi/tracert',
        dataType: 'text',
        timeout: 1500,
        start_time: new Date().getTime(),
        success: function (data) {
            let tempDate = new Date();
            let clientResponseDate = data.inikv("ts").split('.').join("")
            console.log(data.inikv("ip"))
            $(".client-" + ipVersion + "-addr").html(data.inikv("ip"))
            $(".client-" + ipVersion + "-addr").val(data.inikv("ip"))
            $(".client-" + ipVersion + "-loc").html(data.inikv("loc"))
            
            performance.getEntries().forEach(pElement => {
                
                if (pElement.name == 'https://' + siteConfig.testHosts[ipVersion] + '/cdn-cgi/tracert') {
                    let ajaxDuration = tempDate - this.start_time
                    let browserDuration = pElement.duration
                    let diff = ajaxDuration - browserDuration
                    $(".client-" + ipVersion + "-latency").html(Math.round(browserDuration) + ' ms');
                    $( ".if-"+ipVersion+"-ok" ).prop( "disabled", false );
                }

            });
        },
        error: function (data) {
            $( ".if-"+ipVersion+"-ok" ).prop( "disabled", true );
            console.log(data)
        }
      });
});
