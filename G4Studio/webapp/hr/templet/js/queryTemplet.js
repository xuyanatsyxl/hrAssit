/**
 * 综合实例：查询1
 * 
 * @author XiongChun
 * @since 2010-11-20
 */
Ext.onReady(function() {
	
			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

			// 定义列模型
			var cm = new Ext.grid.ColumnModel([ rownum, {
				header : '流水号', // 列标题
				dataIndex : 'hr_eventid', // 数据索引:和Store模型对应
				width : 200,
				sortable : true		
			}, {
				header : '变动类型',
				dataIndex : 'bdlx',
				renderer : BDLXRender
			}, {
				header : '部门编码',
				dataIndex : 'deptid',
				sortable : true
			}, {
				header : '部门名称',
				dataIndex : 'deptname'
			}, {
				header : '姓名',
				dataIndex : 'xm'
			}, {
				header : '性别',
				dataIndex : 'xb',
				renderer : XBRender
			}, {
				header : '身份证号',
				dataIndex : 'sfzh',
				width : 200
			}, {
				header : '操作员',
				dataIndex : 'czy'
			}, {
				header : '操作时间',
				dataIndex : 'czsj'
			}, {
				header : '备注',
				dataIndex : 'bz'
			}]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : 'lxy.do?reqCode=queryLxybdjl'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [ {
					name : 'hr_eventid' // Json中的属性Key值
				}, {
					name : 'bdlx'
				}, {
					name : 'deptid'
				}, {
					name : 'deptname'
				}, {
					name : 'ryid'
				}, {
					name : 'rybh'
				}, {
					name : 'xm'
				}, {
					name : 'xb'
				}, {
					name : 'sfzh'
				}, {
					name : 'czy'
				}, {
					name : 'czsj'
				}, {
					name : 'bz'
				} ])
			});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = qForm.getForm().getValues();
			});
			// 每页显示条数下拉选择框
			var pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				triggerAction : 'all',
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
				}),
				valueField : 'value',
				displayField : 'text',
				value : '20',
				editable : false,
				width : 85
			});

			// 改变每页显示条数reload数据
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
			var number = parseInt(pagesize_combo.getValue());
			// 分页工具栏
			var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
			});

			// 表格工具栏
			var tbar = new Ext.Toolbar({
				items : [ {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						qWindow.show();
					}
				}, {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store.reload();
					}
				}, {
					text : '导出',
					iconCls : 'page_excelIcon',
					handler : function() {
					  exportExcel('lxy.do?reqCode=queryLxybdjlForExcel');
						
			    }
				} ]
			});

			// 表格实例
			var grid = new Ext.grid.GridPanel({
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				margins : '3 3 3 3',
				// collapsible : true,
				border : true,
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">联销员异动记录查询</span>',
				// height : 500,
				autoScroll : true,
				frame : true,
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				tbar : tbar,
				bbar : bbar,// 分页工具栏
				viewConfig : {
					// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
					forceFit : true
				},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});

			// 布局
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ grid ]
			});

			// 查询表格数据
			function queryBalanceInfo(pForm) {
				var params = pForm.getValues();
				params.start = 0;
				params.limit = bbar.pageSize;
				store.load({
					params : params
				});
			}

		});