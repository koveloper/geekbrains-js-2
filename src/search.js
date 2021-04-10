import Vue from '../lib/vue.esm.browser.js';

const registerSearch = () => {
	Vue.component('app-header-search-field', {
		props: [
			'isShown'
		],
		template:  
            `<input 
                class="app-search-field" 
                v-bind:class="{ 'app-search-field-show': isShown }"
                type='text' 
                placeholder='начните вводить название товара'
                v-on:keyup="searchFieldChanged">`,
		methods: {
			searchFieldChanged($event) {
				this.$emit('search-field-changed', $event);
			}
		},
	});
	Vue.component('app-header-search-btn', {
		template: 
            `<div class="app-search-btn">
                <svg version="1.1" 
					
					id="app-search-svg" 
					v-on:click="svgClickHandler" 
					
					xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 52.966 52.966" style="enable-background:new 0 0 52.966 52.966;" xml:space="preserve">
                    <path d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21
                        c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279
                        C52.074,52.304,52.086,51.671,51.704,51.273z M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19
                        S32.459,40,21.983,40z"/>
                </svg>                  
            </div>`,
		methods: {
			svgClickHandler() {
				this.$emit('svg-click');
			}
		}
	});
	Vue.component('app-header-search', {
		template: 
            `<div class="app-search" v-bind:class="{ 'app-search-field-show': isShown }">
                <app-header-search-btn 
                    v-on:svg-click='openSearchField'/>
                <app-header-search-field 
                    v-on:search-field-changed='searchFieldChanged'
                    v-bind:is-shown='isShown'/>
            </div>`,
		data() {
			return {
				_isShown: false
			};            
		},
		methods: {
			openSearchField() {
				this.$data._isShown = !this.$data._isShown;
			},
			searchFieldChanged($event) {
				this.$emit('search-field-changed', $event);
			}
		},
		computed: {
			isShown() {
				return this.$data._isShown;
			}
		}
	});
};

export default registerSearch;