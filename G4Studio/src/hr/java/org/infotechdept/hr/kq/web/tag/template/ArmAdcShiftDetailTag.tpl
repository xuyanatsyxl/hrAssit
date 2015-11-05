<!-- 由<G4Studio:arm.AdcShiftDetail/>标签生成的代码开始 -->
<div id="AdcShiftDetail"></div>
<script type="text/javascript">
Ext.onReady(function() {
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(),
					sm, {
						dataIndex : 'shift_id',
						hidden : true
					}, {
						header : '子班次名称',
						dataIndex : 'c_shift_name',
						width : 120
					}, {
						header : '班次类型',
						dataIndex : 'shift_type',
						width : 130
					}, {
						header : '上班时间',
						dataIndex : 'work_time',
						width : 80
					}, {
						header : '下班时间',
						dataIndex : 'off_time',
						width : 80
					}, {
						header : '周休日',
						dataIndex : 'rest_day',
						width : 100
					}, {
						dataIndex : 'item_id',
						hidden : true
					} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshift.do?reqCode=queryAdcShiftDetailItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'item_id'
						}, {
							name : 'shift_id'
						}, {
							name : 'c_shift_name'
						}, {
							name : 'shift_type'
						}, {
							name : 'work_time'
						}, {
							name : 'off_time'
						}, {
							name : 'rest_day'
						} ])
					});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = {
					queryParam : Ext.getCmp('queryParam').getValue()
				};
			});
			
			var pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
				}),
				valueField : 'value',
				displayField : 'text',
				value : '50',
				editable : false,
				width : 85
			});
			
			var number = parseInt(pagesize_combo.getValue());
			pagesize_combo.on("select", function(comboBox) {
				bbar.pageSize = parseInt(comboBox.getValue());
				number = parseInt(comboBox.getValue());
				store.reload({
					params : {
						start : 0,
						limit : bbar.pageSize
					}
				});
			});

			var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
			});

			var grid = new Ext.grid.GridPanel({
				title : '<span class="commoncss">班次明细</span>',
				height : 500,
				// width:600,
				autoScroll : true,
				region : 'center',
				margins : '3 3 3 3',
				store : store,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
				// autoExpandColumn : 'remark',
				cm : cm,
				sm : sm,
				tbar : [ {
					text : '新增',
					iconCls : 'page_addIcon',
					handler : function() {
						addInit();
					}
				}, '-', {
					text : '修改',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						editInit();
					}
				}, '-', {
					text : '删除',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteAdcShiftItem();
					}
				}, '->', new Ext.form.TextField({
					id : 'queryParam',
					name : 'queryParam',
					emptyText : '请输入人员名称',
					enableKeyEvents : true,
					listeners : {
						specialkey : function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								queryUserItem();
							}
						}
					},
					width : 130
				}), {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						queryUserItem();
					}
				}, '-', {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store.reload();
					}
				} ],
				bbar : bbar
			});
			
	store.load({
				params : {
					start : 0,
					limit : bbar.pageSize,
					shift_id : $shift_id,
					firstload : 'true'
				}
			});
	
})
</script>
<!-- 由<G4Studio:arm.AdcShiftDetail/>标签生成的代码结束 -->