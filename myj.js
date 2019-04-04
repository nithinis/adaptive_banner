window.discover = window.discover || {};
discover.omu_at = discover.omu_at || {};
discover.omu_at.init = (function(loadflag){
    var initialized = false, pageName,
        placements={}, areas=[];
    var init = function(){
        if(initialized) return;
        initialized = true;
        console.log('initialized');
        processDMPAreas();
    }
    var processDMPAreas = function(){
        $('[data-areaid]').each(function(){
            var thisArea= $(this),
            areaid = thisArea.attr('data-areaid'),
            placementName = thisArea.find('[data-omu-offer]').attr('data-omu-offer');
            pageName = thisArea.attr('data-pagename');
            areas.push({id:areaid, domNode: thisArea});
            placements[areaid] = placementName;
        }).addClass('hideloader');
        processClickTrackers();
        fire_impressions();
        //run placement specific scripts
        window.discover&&discover.dmp_scripts&&discover.dmp_scripts.init&&discover.dmp_scripts.init();

    }
    var processClickTrackers = function(){
        var area,trackVal;
         for(let index=0; index<areas.length; index++){
            area = areas[index];
            area.domNode.find('a').each(function(){
                var trackVal = "omclk="+ pageName +"|"+area.id + "|" + placements[area.id]+"|";
                this.href = this.href.replace("omclk=", trackVal);
                
                var dataTrackAttr = this.getAttribute('data-track');
                if(dataTrackAttr !== null){
                    this.setAttribute('data-track', dataTrackAttr.replace("omclk=".trackVal));
                }

            })
         }
    }
    var fire_impressions = function(){
        var list = "", delim = "", area;
        for(let index=0; index<areas.length; index++){
            area = areas[index];
            if(index>0) delim="|";
            list = list + delim + area.id + ":" + placements[area.id]
        }
        console.log('firing site cat impressions: ' + list)
    }
    if(loadflag){
        init();
    }
    return init.bind(this);
})(discover.omu_at.loaded);