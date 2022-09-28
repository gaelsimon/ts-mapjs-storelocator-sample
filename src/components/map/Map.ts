import Component from '../Component';
import Urls from "../../configuration/urls.config";
import {loadScript} from '../../utils/LoadScript';

export interface IMap {
    containerId: string;
    woosmapPublicKey: string;
    mapOptions: woosmap.map.MapOptions;
    storesStyle: woosmap.map.Style;
}

export default class Map extends Component<IMap> {
    private map!: woosmap.map.Map;
    private storesOverlay!: woosmap.map.StoresOverlay;

    init(): void {
        this.$element = document.createElement('div');
        this.$element.className = 'map';
        this.$element.id = this.state?.containerId || 'MapContainer';
        this.$target.appendChild(this.$element);
    }

    render() {
        if (this.state && this.$element) {
            loadScript({url: Urls.mapJS, attributes: {"key": this.state!.woosmapPublicKey}})
                .then(() => {
                    this.initMapView();
                })
                .catch((error) => {
                    console.error("failed to load the Woosmap Map JS SDK script", error);
                });
        }
    }

    initMapView() {
        this.map = new woosmap.map.Map(this.$element!.id,this.state!.mapOptions);
        this.storesOverlay = new woosmap.map.StoresOverlay(this.state!.storesStyle);
        this.storesOverlay.setMap(this.map);
    }
}
