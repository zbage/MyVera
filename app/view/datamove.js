Ext.define('myvera.view.datamove', {
	extend: 'Ext.DataView',
	xtype: 'datamove',
	requires:['Ext.util.Draggable', 'myvera.util.Templates'],
	stores: ['devicesStore'],
	draggablerecord: new Array(),
	config: {
		emptyText: locale.getSt().misc.nodevice,
		store: 'devicesStore',
		scrollable: null,
		currentrecord: null,
		autoDestroy: false,
		listeners:{
			painted:function(e,d){
				this.draggablerecord= [];
				myvera.app.getController('myvera.controller.contdevices').stopsynchro();
				console.log(this.id + " painted");
			},
			itemtouchstart: function(me, index, target, record, e, eOpts) {
				this.setCurrentrecord(record);				
				if(!Ext.Array.contains(this.draggablerecord, record.get('id'))) {
					//console.log("create draggable", target);
					this.draggablerecord.push(record.get('id'));
					var currentdrag = new Ext.util.Draggable({
						element: target,
						constraint: ({
							min: { x: -Infinity, y: -Infinity },
							max: { x: Infinity, y: Infinity }
						}),
						listeners: {
							//drag: this.onDrag,
							dragend: this.onDrop,
							//dragstart: this.onDragStart,
							scope: this
						}
					});
				}
			}
		}
	},
	onDrop: function(el, e, offsetX, offsetY, eOpts) {
		var currecord=this.getCurrentrecord();
		console.log("drop left: " + currecord.get('left') + " offsetX: " + offsetX);
		if(currecord.get('etage')==this.config.idfloor) {
			currecord.set('left', currecord.get('left')+ offsetX);
			currecord.set('top', currecord.get('top')+ offsetY);
		} else if(currecord.get('etage1')==this.config.idfloor) {
			currecord.set('left1', currecord.get('left1')+ offsetX);
			currecord.set('top1', currecord.get('top1')+ offsetY);
		} else if(currecord.get('etage2')==this.config.idfloor) {
			currecord.set('left2', currecord.get('left2')+ offsetX);
			currecord.set('top2', currecord.get('top2')+ offsetY);
		} else {
			alert(locale.getSt().misc.noview +" !");
			return;
		}
		el.setOffset(0,0);
		myvera.app.getController('myvera.controller.contconfig').alertDirtydevices();		
	}
});