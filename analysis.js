        let fileName = 'buildings_group.csv'

    d3.csv(fileName, initiate2, load_data);
    function initiate(d){
        //X,Y,B1_PER_TYPE,ISSUED_YEAR
        // list = ['X','Y','B1_PER_ID1','B1_PER_ID3','B1_ALT_ID','B1_PARCEL_NBR','']
        // result = {
        // }                // incomeWithExpenditure.push(result);
        result = [
            // d.X,
            // d.Y,
            d.OBJECTID,
            d.B1_PER_ID1,
            d.B1_PER_ID3,
            d.B1_ALT_ID,
            d.B1_PARCEL_NBR,
            d.B1_HSE_NBR_START,
            d.B1_STR_DIR,
            d["B1_STR_NAME"],
            d.B1_STR_SUFFIX,
            d.B1_STR_SUFFIX_DIR,
            d.LSN,
            d.APPLICANT_BUS_NAME,
            d.APPLICANT_FULL_NAME,
            d.B1_PER_GROUP,
            d.B1_PER_TYPE,
            d.B1_PER_SUB_TYPE,
            d.B1_PER_CATEGORY,
            d.GENERAL_TYPE,
            d.PERMIT_STATUS,
            d.SQFT,
            d.G3_VALUE_TTL,
            d.ISSUED_DT,
            d.ISSUED_YEAR,
            d.LAST_STATUS_DT,
            d.ZIP_CODE,
            d.COLS_KEY,
            d.GEO_SOURCE
        ]
        //columns
        
        return result;  
    } 

    function intiate2(d){
        result = {
            year: d['ISSUED_YEAR'],
            type: d['B1_PER_TYPE'], 
            count:parseInt(d['count']), 
            percent: parseFloat(d['percentage'])}   
                    // incomeWithExpenditure.push(result);
        return result;  

    }
     
    function loadingHighCharts(data1, data2){
        console.log(data2[0])
        Highcharts.chart('container', {
            chart:{
                type:'pie'
            },
            title:{
                text:'Buildings in Recent Years'
            },
        // subtitle: {
     //        text: 'Click the slices to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
     //    },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y}'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
        },

        "series": data1,

        "drilldown": {
            "series":data2
        }
        
        })


    }

    function load_data(error,data){
        if (error) throw error;

        //Create a hash 
        buildingHash = {};

        // print the original data
        // console.log(data[0].count+1)
        //process the js data group by year first
        data.forEach(function(d,i){
            if (!(d.type in buildingHash)){
                // console.log(d.count)
                buildingHash[d.type] = d.count;
            }else{
                buildingHash[d.type] += d.count;
            }
        })  

        data1 = [];
        data2 = [];
        // console.log(buildingHash)
        // iterate over the key, building the objects
        for(var key in buildingHash){
            data1.push(
                {"name":key,
                "y": buildingHash[key],
                "drilldown": key
                }
            );
        }

        yearHash = {};
        for(key in buildingHash){
                yearHash[key] = []
                data.forEach(function(d,i){
                    if(d.type==key){
                        yearHash[key].push([d.year,d.count]);
                }
            })
        }

        //
        console.log(data1[0])
        
        // build the data for the first layer
        dataByBuilding = [{
            "name":"Buildings",
            "colorByPoint":true,
            "data":data1 }];

        // console.log(dataByBuilding)

        for(key in buildingHash){
            data2.push(
            {"name":key,
             "id": key,
             "data":yearHash[key]
            });
        }
        // loading the high charts
        loadingHighCharts(dataByBuilding, data2);
        var fileName2 = "Building_Details1.csv";
        console.log("ffff");
        d3.csv(fileName2,initiate,loadDetails);

    }

    function loadDetails(error,dataSet){   
        console.log(dataSet[0])
        var str = "X,Y,OBJECTID,B1_PER_ID1,B1_PER_ID3,B1_ALT_ID,B1_PARCEL_NBR,B1_HSE_NBR_START,B1_STR_DIR,B1_STR_NAME,B1_STR_SUFFIX,B1_STR_SUFFIX_DIR,LSN,APPLICANT_BUS_NAME,APPLICANT_FULL_NAME,B1_PER_GROUP,B1_PER_TYPE,B1_PER_SUB_TYPE,B1_PER_CATEGORY,GENERAL_TYPE,PERMIT_STATUS,SQFT,G3_VALUE_TTL,ISSUED_DT,ISSUED_YEAR,LAST_STATUS_DT,ZIP_CODE,COLS_KEY,GEO_SOURCE"
        var arrNames = str.split(',')
        nameColumns = []
        arrName.forEach(function(d,i){
            nameColumns.push[{"title":d}]
        })

        // load the data 
         $(document).ready(function() {
                $('#DataTable').DataTable( {
                    data:dataSet
                    columns:nameColumns
                    dom: 'Bfrtip',
                    buttons: [
                        'columnsToggle'
                        // 'copyHtml5',
                        // 'excelHtml5',
                        // 'csvHtml5',
                        // 'pdfHtml5'
                    ]
                   } );
            } );
    }