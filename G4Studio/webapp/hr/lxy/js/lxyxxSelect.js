Ext
		.onReady(function() {
			
			var DQZTCombo = new Ext.form.ComboBox({
				
				name : 'dqzt',
				hiddenName : 'dqzt',
				store : DQZTStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				// value : '0',
				fieldLabel : '当前状态',
				emptyText : '请选择...',
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});
			var qForm = new Ext.form.FormPanel({
				id:'qForm',				
				margins : '3 3 3 3',
				title : '<span class="commoncss">查询条件<span>',
				collapsible : true,
				border : true,
				labelWidth : 90, // 标签宽度
				// frame : true, //是否渲染表单面板背景色
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				region : 'north',
				buttonAlign : 'center',
				height : 100,
				items : [ {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .25,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '姓名',
							name : 'xm',
							xtype : 'textfield', // 设置为数字输入框类型
							anchor : '100%'
						}]
					}, {
						columnWidth : .25,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '身份证号', // 标签
							id : 'xm',
							name : 'sfzh', // name:后台根据此name属性取值
						
							
							anchor : '100%' // 宽度百分比
						}]
					}, {
						columnWidth : .25,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {

							fieldLabel : '联系手机', // 标签
							name : 'lxsj', // name:后台根据此name属性取值							
							anchor : '100%'// 宽度百分比

						} ]
					},{

						columnWidth : .25,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ DQZTCombo ]
					
						
					} ]
				} ],
				buttons : [ {
					text : '查询',
					iconCls : 'previewIcon',
					id:'lxyxxSelect_select',
					handler : function() {
						queryBalanceInfo(qForm.getForm());
					}
				}, {
					text : '重置',
					id:'lxyxxSelect_reset',
					iconCls : 'tbar_synchronizeIcon',
					handler : function() {
						qForm.getForm().reset();
					}
				} ,{
					
					text : '导出',
					id:'lxyxxSelect_excel',
					iconCls : 'page_excelIcon',
					handler:function(){
						if(store.getCount()>0){
							exportExcel('lxyRpt.do?reqCode=queryLxyXXForExcel');
							
						}else{
							Ext.MessageBox.alert('提示',"当前没有可以导出的数据！！");
						}
						
					}
					
				}]
			});

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

			// 定义列模型
			var cm = new Ext.grid.ColumnModel([ rownum, {
				hidden : true,
				header : '人员ID',
				dataIndex : 'ryid',
				width : 35
			},{
				header : '人员编码',
				dataIndex : 'rybh',
				sortable : true,
				width : 80
			}, {
				header : '姓名',
				dataIndex : 'xm',
				sortable : true,
				width : 80
			}, { 
				header : '性别',
				dataIndex : 'xb',
				width : 60,
				sortable : true,
				renderer : XBRender
			},
			 {
				header : '部门名称',
				dataIndex : 'deptname',	
				sortable : true,
				width : 180				
			} ,
			{
				header:'员工星级',
				dataIndex:'ygxj',
				sortable:true,
				width:60,
				renderer:YGXJRender
				
			},
			{
				header:'岗位',
				dataIndex:'gw',
				sortable:true,
				renderer:GWRender,
				width:80			
			},
			{
				header:'年龄',
				dataIndex:'age',
				sortable:true,
				width:80
			},
			{
				header : '出生日期',
				dataIndex : 'csrq',
				//renderer : Ext.util.Format.dateRenderer('Y-m-d'),
				sortable : true,
				width : 120
			},
			{
				header : '厂商名称',
				dataIndex : 'ghdw',
				sortable : true,
				width : 120
				
			},
			{
				header : '品牌',
				dataIndex : 'pp',
				sortable : true,
				width : 80				
			},
			{
				header : '身份证号',
				dataIndex : 'sfzh',
				sortable : true,
				width : 140
			}, {
				header : '婚姻状况',
				dataIndex : 'hyzk',
				sortable : true,
				
				width : 80,
				renderer : HYZKRender
			}, {
				header : '最高学历',
				dataIndex : 'zgxl',
				sortable : true,
				width : 80,
				renderer : XLXZRender
			}, 
			{
				header : '学历性质',
				dataIndex : 'xlxz',
				sortable : true,
				width : 80,
				renderer : XLXZRender
			},
			{
				
				id : 'JZFS',
				header : '居住方式',
				dataIndex : 'jzfs',
				width : 80,
				sortable : true,
				renderer : JZFSRender

			}, {
				// id : 'deptid',
				header : '联系手机',
				sortable : true,
				dataIndex : 'lxsj',
				width : 120
			}, {
				// id : 'deptid',
				header : '紧急联系人',
				sortable : true,
				dataIndex : 'jjlxr',
				width : 100
			}, {
				// id : 'deptid',
				header : '紧急联系人手机',
				sortable : true,
				dataIndex : 'jjlxrsj',
				width : 120
			},{
				header:"当前状态",
				sortable:true,
				dataIndex:'dqzt',
				renderer:DQZTRender
				
			} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : './lxyRpt.do?reqCode=queryLxyxxForManager'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [{
					name : 'ryid'
				}, {
					name : 'rybh'
				}, {
					name : 'xm'
				}, {
					name : 'fullname'
				}, {
					name : 'xb'
				}, 
				{
					name:'ygxj'
				},{
					name : 'csrq'
				}, {
					name : 'sg'
				}, {
					name : 'mz'
				}, {
					name : 'ywbs'
				}, {
					name : 'tz'
				}, {
					name : 'csd'
				}, {
					name : 'zjxy'
				}, {
					name : 'hkszd'
				}, {
					name : 'hkxz'
				}, {
					name : 'sfzh'
				}, {
					name : 'zzmm'
				}, {
					name : 'hyzk'
				}, {
					name : 'zgxl'
				}, {
					name:'xlxz'
				},{
					name : 'jzfs'
				}, {
					name : 'lxsj'
				}, {
					name : 'lxzd'
				}, {
					name : 'jzmj'
				}, {
					name : 'xzj'
				}, {
					name : 'lt'
				}, {
					name : 'jjlxr'
				}, {
					name : 'jjlxrsj'
				}, {
					name : 'jjlxrsj'
				}, {
					name : 'bz'
				}, {
					name : 'jdrq'
				}, {
					name : 'dqzt'
				}, {
					name : 'jdr'
				},{
					name:'ghdw'
				},{
					name:'pp'
					
				},{
					name:'deptname'
					
				},{
					name:'age'
				},{
					name:'gw'
					
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

			// 表格实例
			var grid = new Ext.grid.GridPanel({
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				margins : '3 3 3 3',
				// collapsible : true,
				border : false,
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">联销员信息</span>',
				// height : 500,
				autoScroll : true,
				frame : true,
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				bbar : bbar,// 分页工具栏
				/*viewConfig : {
					// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
					forceFit : true
				},*/
				loadMask : {
					msg : '正在加载数据,请稍等...'
				}
			});

			// 布局
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ qForm, grid ]
			});

			// 查询表格数据
			function queryBalanceInfo(pForm) {
				store.removeAll();
				if(!qForm.form.isValid()){
					return;
				}
				var params = pForm.getValues();
				params.start = 0;
				params.limit = bbar.pageSize;
				store.load({
					params : params
				});
			}

		});