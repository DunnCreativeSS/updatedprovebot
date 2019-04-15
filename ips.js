<head>

<script src="https://code.jquery.com/jquery-1.9.1.js"></script>
<script src="https://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
</head>
let ips = []
console.log(ips)

$.get("http://34.73.210.244:8083/?current_user_id=jare2228528365625318621dddfdfdaugacuacgcuacaccau", {}, function(data, status) {

            console.log(data)
            for (var i in data) {
                for (var ip in data[i].ips) {
                    if (data[i].user_id != 'test123' && data[i].user_id != null) {
                        ips.push(data[i].ips[ip])
                    }
                }
            }
            for (var ip in ips) {
                //chart = Highcharts.stockChart('container', options);
                count = -1
                $.getJSON('http://' + ips[ip] + '/update?name=2', function(jsondata) {
                    count++
                    let diffs = [jsondata.usddiff2, jsondata.altdiff2, jsondata.btcdiff2]
                    let lll = -99999
                    for (var d in diffs) {
                        if (diffs[d] && diffs[d] > lll && diffs[d] > -100) {
                            lll = diffs[d]
                            console.log('lll ' + lll)
                        }
                    }
                    if (lll == -99999) {
                        lll = 0;
                    }
                    let diffs2 = [jsondata.usddiff, jsondata.altdiff, jsondata.btcdiff]
                    let lll2 = -99999

                    for (var d in diffs2) {
                        if (diffs2[d] > lll2 && diffs2[d] && diffs2[d] > -100) {
                            lll2 == diffs2[d]

                        }
                    }
                    if (lll2 == -99999) {
                        lll2 == 0;
                    }
                    console.log(ips[ip] + ' ' + lll + ' ' + lll2)
                })
            }
})