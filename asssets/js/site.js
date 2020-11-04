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

function redirectToLookingGlass(elementName) {
    let hostname = document.getElementById(elementName).textContent;
    window.open(siteConfig["looking-glass"]+"?hostname="+hostname);
}
$(document).ready(function(e) {   
    if (siteConfig["looking-glass"] != undefined && siteConfig["looking-glass"] != null && siteConfig["looking-glass"] != "") {
        $(".looking-glass-button").show()
    } else {
        $(".looking-glass-button").hide()
    }
 });


ipVersions.forEach(ipVersion => {
    $.ajax({
        url: 'https://'+siteConfig.testHosts[ipVersion]+'/cdn-cgi/tracert',
        dataType: 'text',
        timeout: 1500,
        start_time: new Date().getTime(),
        success: function (data) {
            let tempDate = new Date();
            let clientResponseDate = data.inikv("ts").split('.').join("")
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
            $("." + ipVersion + "-border").removeClass("border-danger").addClass("border-success");
        },
        error: function (data) {
            $(".client-" + ipVersion + "-addr").html("No Connection")
            $(".client-" + ipVersion + "-addr").val("...")
            $(".client-" + ipVersion + "-loc").html("...")
            $(".client-" + ipVersion + "-latency").html("...")
            $(".if-" + ipVersion + "-ok").prop("disabled", true);
            $("." + ipVersion + "-border").addClass("border-danger").removeClass("border-success");
            console.log(data)
        }
      });
});
