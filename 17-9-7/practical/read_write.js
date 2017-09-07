// @flow

import Naptime from './naptime';

!function(n){"use strict";function r(n){var r=e(1,n);return r.reduce(function(n,r,t){var o=t+1;return n.map(function(n,r){var t=r+1;return[t,t%o?n[1]:!n[1]]})},t(r,o(n,!1)))}function t(n,r){return n.length===r.length?n.map(function(n,t){return[n,r[t]]}):void 0}function o(n,r){var t=[r],o=[];if(n<1)return o;for(;n>1;)1&n&&(o=o.concat(t)),n>>=1,t=t.concat(t);return o.concat(t)}function u(){new Naptime("/foo").post({})}function e(n,r,t){var o=t||1,u=r>n,e=Math.floor((u?r-n:n-r)/o)+1,c=Array(e),f=e;if(u)for(;f--;)c[f]=o*f+n;else for(;f--;)c[f]=n-o*f;return c}r(100).filter(function(n){return u(),n[1]}).map(function(n){return{door:n[0],open:n[1]}})}();
