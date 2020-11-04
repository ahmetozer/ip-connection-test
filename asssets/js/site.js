String.prototype.inikv = function (regxy) {
    const myRegexp = RegExp("^(?:"+regxy+")=(.*)$","gm");
    let match = myRegexp.exec(this);
    if (match != null) {
        return match[1]
    }
    return null
}

const ipVersions = [ "IPv4", "IPv6" ]

ipVersions.forEach(element => {
    $.ajax({
        url: 'https://'+siteConfig.testHosts[element]+'/cdn-cgi/tracert',
        dataType: 'text',
        timeout: 1500,
        start_time: new Date().getTime(),
        success: function (data) {
            let tempDate = new Date();
            let clientResponseDate = data.inikv("ts").split('.').join("")
            console.log(data.inikv("ip"))
            $(".client-" + element + "-addr").html(data.inikv("ip"))
            $(".client-" + element + "-loc").html(data.inikv("loc"))
            
            performance.getEntries().forEach(element2 => {
                
                if (element2.name == 'https://' + siteConfig.testHosts[element] + '/cdn-cgi/tracert') {
                    let ajaxDuration = tempDate - this.start_time
                    let browserDuration = element2.duration
                    let diff = ajaxDuration - browserDuration
                    $(".client-" + element + "-latency").html(Math.round(browserDuration - diff)  + ' ms');
                }

            });
        },
        error: function (data) {
            console.log(data)
        }
      });
});
