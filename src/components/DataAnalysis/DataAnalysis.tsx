import * as React from 'react';
import  img from '../../assets/img/coverage.jpg';
import '../../style/_dataAnalysis.scss'; 
import Bar from '../../assets/charts/Bar';
import Bar2 from '../../assets/charts/bar2';
import Pie from '../../assets/charts/Pie';

class DataAnalysis extends React.Component{
  public render() {
    return (
      <div id="analysis_body">
            <h3>Server Location and Provider Type</h3>
            <Pie />
            <div className="desc">The regional distribution and types of monitored public WMS providers. (a) shows that while most services are in North America and Europe, among the remaining .6%, Asia contains .23%. (b) shows providers by sector, government has largest proportion (37.69%) followed by academic institutions (34.19%), while industry has smallest proportion (1.78%)</div>
            <h3>Popular Map Subjects</h3>
            <Bar2 />
            <div className="desc"> Figure shows the top map layer keywords with highest word frequencies. According to GEOSS Societal Benefit Areas (SBAs) and INSPIRE directive, we analyzed obtained keywords and found that the following subjects related to the natural environment and resources appear most frequently; including geology, climate, energy, water, biodiversity, agriculture, ecosystem and land cover. Given the explosive growth in earth observation technologies over past several decades, governments, academic institutions, and non-profit organizations have collected and processed a large amount of geographic data about natural phenomena. </div>
            <h3>Yearly Distribution</h3>
            <Bar />
            <div className="desc">The figure illustrates that the significant increase in WMSs and map layers in 2000 and 2006 was strongly associated with the release of the WMS standards version 1.0.0 and version 1.3.0, respectively. The release of the ESRI RESTful Service APIs and successive updates, which are compliant with WMS standard, caused another significant increase, starting in 2010. Moreover, INSPIRE required member states to provide discovery and view services ( i.e., WMS and WMTS) in 2011 at the latest, may also have promoted the deployment and updating of WMSs. These trends reveal that new technologies, standards, and software products are adopted relatively rapidly in the geoinformation domain. However, the enthusiasm for exploring new technologies is hard to maintain when it comes to routine service maintenance. Many of the existing WMSs seldom add new layers or update layer metadata after deployment. Thus, the data collection time for the latest layers in 4124 WMSs among the 4587 WMSs studied (89.91%) is earlier than the year 2013. This may impact the quality of map resources found in online WMSs.</div>
            <h3>Spatial Coverages of Map Layers</h3>
            <img src={img} style={{width:800 +'px', margin:'auto', display: 'block'}}/>
            <div className="desc">By analyzing the geographic extent (i.e., boundingbox) of 318102 map layers (Figure 9), we found that continents are covered more intensively than the oceans except for Antarctica and the Northern Hemisphere has more coverages than Southern Hemisphere. Many of the layers have a global extent (more than 25000 layers). This phenomenon reveals our global earth observation behaviors and also reflects human activities in space, to some degree. The differences on the richness in open geospatial data also reflect the differences in data sharing policies at the country and regional levels. More specifically, spatial coverages of map layers are concentrated in North America and Europe, especially over the mainland of U.S. Europe, and Northern Africa has the second largest number of coverages, after North America and Europe. However, due to information security and data policy issues, geospatial resources are strictly controlled in some countries. Geospatial data are often shared internally and between governmental agencies through hardcopy or secured private networks rather than by publishing them through standardized data and mapping services for public use.</div>
    	</div>
    );
  }
}

export default DataAnalysis;
