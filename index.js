async function getInfo(sta) {
    const res = await fetch(`https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=EAL&sta=${sta}`)
    const json = await res.json()
    const STA_NAME={
        ADM:"金鐘",
        EXC:"會展",
        HUH:"紅磡",
        MKK:"旺角東",
        KOT:"九龍塘",
        TAW:"大圍",
        SHT:"沙田",
        FOT:"火炭",
        RAC:"馬場",
        UNI:"大學",
        TAP:"大埔墟",
        TWO:"太和",
        FAN:"粉嶺",
        SHS:"上水"
    }
    let upInfo=[];
    if(json.data[`EAL-${sta}`].UP){
        upInfo=json.data[`EAL-${sta}`].UP
    }
    let downInfo=[];
    if(json.data[`EAL-${sta}`].DOWN){
        downInfo=json.data[`EAL-${sta}`].DOWN
    }
    //const info = json.data[`EAL-${sta}`].UP
    const currTime = json.curr_time;
    const time = new Date(currTime).toLocaleString("en-GB", {
        hour:'2-digit',
        minute:'2-digit'
    })
    
    arrivalTime(upInfo,'up-message');
    arrivalTime(downInfo,'down-message');
    function arrivalTime(direction,cssName){
        let result = `<div id="time"><div>${STA_NAME[sta]}</div> <div>${time}</div></div>`;
        for (let index of direction)
        {
            let css="";
            const isEvenRow=index.seq%2===0;
            if (isEvenRow)
            {
                css="white-box blue-box"
            }
            else{
                css="white-box"
            }
            result += `<div class="${css}">
            <div class="destination">${STA_NAME[index.dest]}</div>
            <div class="platform">${index.plat}</div>
            <div class="minute">${getTimeDiff(currTime,index.time)}</div>
            </div>`
        }

        document.getElementById(cssName).innerHTML = result;

    }
    
 }

function getTimeDiff(curr,target){
    const currTimestamp=new Date(curr).getTime();
    const targetTimestamp=new Date(target).getTime();
    const timeLeft=Math.ceil((targetTimestamp-currTimestamp)/1000/60);
    if(timeLeft===1){
        return "即將到達"
    }else if(timeLeft<=0){
        return "即將離開"
    }else{
        return `${timeLeft}<span class="unit">分鐘</span>`
    }
}

getInfo('TAP');
