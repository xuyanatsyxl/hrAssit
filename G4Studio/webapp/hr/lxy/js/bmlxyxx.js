Ext
		.onReady(function() {

			var addRoot = new Ext.tree.AsyncTreeNode({
				text : root_deptname,
				expanded : true,
				id : root_deptid
			});
			var addDeptTree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
					baseAttrs : {},
					dataUrl : '../user.do?reqCode=departmentTreeInit'
				}),
				root : addRoot,
				autoScroll : true,
				animate : false,
				useArrows : false,
				border : false
			});

			
			addDeptTree.on('click', function(node) {
				comboxWithTree.setValue(node.text);
				Ext.getCmp("qForm").findById('deptid').setValue(
						node.attributes.id);

				comboxWithTree.collapse();
			});

			var comboxWithTree = new Ext.form.ComboBox(
					{
						id : 'deptname',
						store : new Ext.data.SimpleStore({
							fields : [],
							data : [ [] ]
						}),
						editable : false,						
						value : '',
						emptyText : '请选择...',
						fieldLabel : '所属部门',
						//allowBlank : false,
						//labelStyle : 'color:blue',              
						anchor : '100%',
						mode : 'local',
						triggerAction : 'all',
						maxHeight : 390,
						// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
						tpl : "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
						
						onSelect : Ext.emptyFn
					});
			// 监听下拉框的下拉展开事件
			comboxWithTree.on('expand', function() {
				// 将UI树挂到treeDiv容器
				addDeptTree.render('addDeptTreeDiv');
				// addDeptTree.root.expand(); //只是第一次下拉会加载数据
				addDeptTree.root.reload(); // 每次下拉都会加载数据

			});				
			
			
			var GWCombo = new Ext.form.ComboBox({
				
				name : 'gw',
				hiddenName : 'gw',
				store : GWStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				// value : '0',
				fieldLabel : '员工岗位',
				emptyText : '请选择...',
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});
          
          
          
          
          
			var qForm = new Ext.form.FormPanel({
				id:'qForm',
				region : 'north',
				margins : '3 3 3 3',
				title : '<span class="commoncss">查询条件<span>',
				collapsible : true,
				border : true,
				labelWidth : 90, // 标签宽度
				// frame : true, //是否渲染表单面板背景色
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 125,
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
						}, comboxWithTree]
					}, {
						columnWidth : .25,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '身份证号', // 标签							
							name : 'sfzh', // name:后台根据此name属性取值						
							
							anchor : '100%' // 宽度百分比
						}, GWCombo]
					}, {
						columnWidth : .25,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {

							fieldLabel : '厂商名称', // 标签
							name : 'ghdw', // name:后台根据此name属性取值							
							anchor : '100%'// 宽度百分比

						},{

							type:'numberfield',
							fieldLabel : '年龄从', // 标签
							name : 'minage', // name:后台根据此name属性取值							
							anchor : '100%'// 宽度百分比
								

						} ]
					}, {

						columnWidth : .24,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {

							fieldLabel : '品牌名称', // 标签
							name : 'pp', // name:后台根据此name属性取值
							anchor : '100%'// 宽度百分比

						},  {
							type:'numberfield',
							fieldLabel : '至', // 标签
							name : 'maxage', // name:后台根据此name属性取值
							anchor : '100%'// 宽度百分比

						}  ]

					},{


						columnWidth : .01,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [  {

							id : 'deptid',
							name : 'deptid',
							hidden : true

						}  ]

					
						
					} ]
				} ],
				buttons : [ {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						queryBalanceInfo(qForm.getForm());
					}
				}, {
					text : '重置',
					iconCls : 'tbar_synchronizeIcon',
					handler : function() {
						qForm.getForm().reset();
					}
				} ,{
					
					text : '导出',
					iconCls : 'page_excelIcon',
					handler:function(){
						if(store.getCount()>0){
							exportExcel('lxyRpt.do?reqCode=querybmLxyXXForExcel&dqzt=2');
							
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
			var sm = new Ext.grid.CheckboxSelectionModel();
			// 定义列模型
			var cm = new Ext.grid.ColumnModel([ sm,rownum, {
				hidden : true,
				header : '人员ID',
				dataIndex : 'ryid',
				width : 35
			}, {
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

				header : '岗位',
				dataIndex : 'gw',
				width : 80,
				sortable : true,
				renderer : GWRender
			},
			{
				header:'年龄',
				dataIndex:'age',
				width:80,
				sortable:true
				
				
			},
			{
				header:'员工星级',
				dataIndex:'ygxj',
				width:60,
				sortable:true,
				renderer:YGXJRender
			}, {
				header : '星级有效期',
				dataIndex : 'xjjsrq',
				width : 120,
				sortable : true
			}, {
				header : '出生日期',
				dataIndex : 'csrq',
				// renderer : Ext.util.Format.dateRenderer('Y-m-d'),
				sortable : true,
				width : 120
			}, {
				header : '部门名称',
				dataIndex : 'deptname',	
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

				header : '入企时间',
				dataIndex : 'ydrq',
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
				
			// id : 'JZFS',
				header : '居住方式',
				dataIndex : 'jzfs',
				width : 80,
				sortable : true,
				renderer : JZFSRender
			}, {			
				header : '联系手机',
				sortable : true,
				dataIndex : 'lxsj',
				width : 120
			}, {				
				header : '紧急联系人',
				sortable : true,
				dataIndex : 'jjlxr',
				width : 100
			}, {				
				header : '紧急联系人手机',
				sortable : true,
				dataIndex : 'jjlxrsj',
				width : 120
			},{
				header:'当前状态',
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
					url : './lxyRpt.do?reqCode=querybmLxyxxForManager'
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
				},{
					name:'ygxj'
				}				
				, {
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
				}
				, {
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
					
				},{		
					name : 'ydrq'
				}, {
					name : 'xjjsrq'
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
				/*
				 * viewConfig : { // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况 forceFit :
				 * true },
				 */
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
				var params = pForm.getValues();
				params.start = 0;
				params.limit = bbar.pageSize;
				store.load({
					params : params
				});
			}

			
			// 监听行双击事件
			grid.on('rowdblclick', function(pGrid, rowIndex, event) {
								
				editInit();
			});
			
			function editInit() {
				// Ext.getCmp('btnReset').hide();
				var record = grid.getSelectionModel().getSelected();
				// var record=grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
					// Ext.MessageBox.alert(record.get('ryid'));
					return;
				}
				// Ext.MessageBox.alert('提示', record.length);
				if(record.length>1){
					Ext.MessageBox.alert('提示', '每次只能修改一条!');
					// Ext.MessageBox.alert(record.get('ryid'));
					return
					
				}
				
				addUserForm.getForm().loadRecord(record);
				addUserWindow.show();
				addUserWindow.setTitle('<span class="commoncss">查看人员详细信息</span>');
				
				
				Ext.getCmp('ryid').setValue(record.get('ryid'));
				tabs.activate(0);
										
				XUELIstore.load({
					params : {
						start:0,
						limit:XUELIbbar.pageSize,
						ryid:record.get('ryid')
					}
				});
				GZstore.load({
					params : {
						start:0,
						limit:GZbbar.pageSize,
						ryid:record.get('ryid')
					}
				});
				
				JJstore.load({
					params:{
						start:0,
						limit:JJbbar.pageSize,
						ryid:record.get('ryid')
					}
					
				});
				xjstore.load({
					params:{
						start:0,
						limit:xjbbar.pageSize,
						ryid:record.get('ryid')
					}
					
				});
			}
			
			
			var XBCombo = new Ext.form.ComboBox({
				name : 'xb',				
				hiddenName : 'xb',
				store : XBStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '性别',
				emptyText : '请选择...',
				
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});

			var HYZKCombo = new Ext.form.ComboBox({
				name : 'hyzk',
				hiddenName : 'hyzk',
				store : HYZKStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '婚姻状态',
				emptyText : '请选择...',
				
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});

			var JZFSCombo = new Ext.form.ComboBox({
				name : 'jzfs',
				hiddenName : 'jzfs',
				store : JZFSStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '居住方式',
				emptyText : '请选择...',
				
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});

			var XLXZCombo = new Ext.form.ComboBox({
				name : 'xlxz',				
				hiddenName : 'xlxz',
				store : XLXZStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '学历性质',
				emptyText : '请选择...',
				
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});

			var HKXZCombo = new Ext.form.ComboBox({
				name : 'hkxz',				
				hiddenName : 'hkxz',
				store : HKXZStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '户口性质',
				emptyText : '请选择...',
				
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});

			var addUserForm = new Ext.form.FormPanel(
					{
						// frame : true, //是否渲染表单面板背景色

						labelAlign : 'right', // 标签对齐方式
						margins : '3 3 3 3',
						bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
						/*
						 * width:800, height: 800,
						 */
						items : [
								{

									border : false,
									layout : 'column',
									items : [ {
										labelWidth : 60, // 标签宽度
										columnWidth : 0.99,
										defaultType : 'textfield',
										layout : 'form',
										border : false,
										items : [ {											
											fieldLabel : '身份证号', // 标签
											name : 'sfzh', // name:后台根据此name属性取值
											id:'addusersfzh',
											regex : /^(\d{18,18}|\d{15,15}|\d{17,17}X)$/,
											maxLength : 18, // 可输入的最大文本长度,不区分中英文字符
											
											enableKeyEvents : true,
											listeners : {
												specialkey : function(field, e) {
													if (e.getKey() == Ext.EventObject.ENTER) {
														loadbirthday();// 通过身份证号获取出生日期和性别
													}
												}
											},
											anchor : '100%'// 宽度百分比
										} ]

									} ]

								},
								{
									layout : 'column',
									border : false,
									items : [ {
										columnWidth : .33,
										defaultType : 'textfield',
										labelWidth : 60, // 标签宽度
										layout : 'form',
										border : false,
										items : [ {
											
											fieldLabel : '姓名', // 标签
											id : 'xm',
											name : 'xm', // name:后台根据此name属性取值
											maxLength : 6, // 可输入的最大文本长度,不区分中英文字符
											

											anchor : '100%'// 宽度百分比
										}, {

											xtype : 'numberfield', // 设置为数字输入框类型
											// emptyText :'单位是cm',
											fieldLabel : '身高', // 标签
											name : 'sg', // name:后台根据此name属性取值
											id : 'sg',
										
											maxLength : 7, // 可输入的最大文本长度,不区分中英文字符
											anchor : '100%'// 宽度百分比
										}, {
											fieldLabel : '出生地',

											name : 'csd',
											id : 'csd',
											anchor : '100%'
										}, {
											fieldLabel : '体重', // 标签
											// emptyText:'单位是kg',
											xtype : 'numberfield',
											name : 'tz', // name:后台根据此name属性取值
											id : 'tz',
											
											anchor : '100%'// 宽度百分比
										}

										]
									}, {

										columnWidth : .33,
										defaultType : 'textfield',
										layout : 'form',
										labelWidth : 60, // 标签宽度
										border : false,
										items : [ XBCombo, {
											fieldLabel : '民族', // 标签
											name : 'mz', // name:后台根据此name属性取值
											id : 'mz',
											maxLength : 10, // 可输入的最大文本长度,不区分中英文字符

											anchor : '100%'// 宽度百分比
										}, {
											fieldLabel : '宗教信仰',
											name : 'zjxy',
											id : 'zjxy',
											anchor : '100%'
										}, HKXZCombo ]

									}, {

										columnWidth : .33,
										defaultType : 'textfield',
										layout : 'form',
										border : false,
										labelWidth : 60, // 标签宽度
										items : [ {
											fieldLabel : '出生日期', // 标签
											xtype : 'datefield',
											format : 'Y-m-d',
											name : 'csrq', // name:后台根据此name属性取值
											id : 'csrq',
											
											anchor : '100%'// 宽度百分比
										}, {
											fieldLabel : '有无病史', // 标签
											name : 'ywbs', // name:后台根据此name属性取值
											id : 'ywbs',
											anchor : '100%'// 宽度百分比
										}, {
											fieldLabel : '户口地',
											
											name : 'hkszd',
											id : 'hkszd',
											anchor : '100%'
										}, HYZKCombo ]

									} ]
								},
								{

									layout : 'column',
									border : false,
									items : [ {
										columnWidth : .33,
										defaultType : 'textfield',
										labelWidth : 60, // 标签宽度
										layout : 'form',
										border : false,
										items : [ {
											fieldLabel : '最高学历', // 标签
											name : 'zgxl', // name:后台根据此name属性取值
											id : 'zgxl',
											
											anchor : '100%'// 宽度百分比
										} ]
									}, {

										columnWidth : .33,
										defaultType : 'textfield',
										layout : 'form',
										labelWidth : 60, // 标签宽度
										border : false,
										items : [ XLXZCombo ]

									}, {
										columnWidth : .33,
										defaultType : 'textfield',
										layout : 'form',
										labelWidth : 60, // 标签宽度
										border : false,
										items : [ JZFSCombo ]
									}

									]

								},
								{
									layout : 'column',
									border : false,
									items : [
											{
												columnWidth : .33,
												defaultType : 'textfield',
												layout : 'form',
												labelWidth : 60, // 标签宽度
												border : false,
												items : [ {
													fieldLabel : '联系手机', // 标签
													name : 'lxsj', // name:后台根据此name属性取值
													id : 'lxsj',
													regex : /^(\d{7}|\d{8}|\d{11})$/,
													maxLength : 18, // 可输入的最大文本长度,不区分中英文字符
													

													anchor : '100%'// 宽度百分比
												} ]
											},
											{

												columnWidth : .33,
												defaultType : 'textfield',
												layout : 'form',
												labelWidth : 60, // 标签宽度
												border : false,
												items : [ {
													fieldLabel : '联系宅电', // 标签
													name : 'lxzd', // name:后台根据此name属性取值
													id : 'lxzd',
													regex : /^(\d{7}|\d{8}|\d{11})$/,
													maxLength : 18, // 可输入的最大文本长度,不区分中英文字符

													anchor : '100%'// 宽度百分比
												} ]

											}, {

												columnWidth : .33,
												defaultType : 'textfield',
												layout : 'form',
												labelWidth : 60, // 标签宽度
												border : false,
												items : [ {
													fieldLabel : '居住面积', // 标签
													name : 'jzmj', // name:后台根据此name属性取值
													id : 'jzmj',
													xtype : 'numberfield',
													
													maxLength : 18, // 可输入的最大文本长度,不区分中英文字符
													anchor : '100%'// 宽度百分比
												} ]

											} ]

								},
								{
									layout : 'column',
									border : false,
									items : [ {
										columnWidth : .66,
										defaultType : 'textfield',
										layout : 'form',
										labelWidth : 60, // 标签宽度
										border : false,
										items : [ {
											fieldLabel : '现住址', // 标签
											name : 'xzj', // name:后台根据此name属性取值
											id : 'xzj',
											maxLength : 200, // 可输入的最大文本长度,不区分中英文字符
											anchor : '100%'// 宽度百分比
										} ]
									}

									, {

										columnWidth : .33,
										defaultType : 'textfield',
										layout : 'form',
										labelWidth : 60, // 标签宽度
										border : false,
										items : [ {
											fieldLabel : '路途', // 标签
											name : 'lt', // name:后台根据此name属性取值
											id : 'lt',
											
											emptyText : '上班方式',
											maxLength : 18, // 可输入的最大文本长度,不区分中英文字符
											anchor : '100%'// 宽度百分比
										} ]

									} ]

								},
								{
									layout : 'column',
									border : false,
									items : [
											{
												columnWidth : .33,
												defaultType : 'textfield',
												layout : 'form',
												labelWidth : 60, // 标签宽度
												border : false,
												items : [ {
													fieldLabel : '紧急系人', // 标签
													name : 'jjlxr', // name:后台根据此name属性取值
													id : 'jjlxr',
													
													maxLength : 18, // 可输入的最大文本长度,不区分中英文字符
													anchor : '100%'// 宽度百分比
												} ]
											},
											{

												columnWidth : .33,
												defaultType : 'textfield',
												layout : 'form',
												labelWidth : 60, // 标签宽度
												border : false,
												items : [ {
													fieldLabel : '紧急手机', // 标签
													name : 'jjlxrsj', // name:后台根据此name属性取值
													id : 'jjlxrsj',
													regex : /^(\d{7}|\d{8}|\d{11})$/,
													
													anchor : '100%'// 宽度百分比
												} ]

											}

											,
											{

												columnWidth : .33,
												defaultType : 'textfield',
												layout : 'form',
												labelWidth : 60, // 标签宽度
												border : false,
												items : [ {
													fieldLabel : '紧急宅电', // 标签
													name : 'jjlxrzd', // name:后台根据此name属性取值
													id : 'jjlxrzd',
													regex : /^(\d{7}|\d{8}|\d{11})$/,

													anchor : '100%'// 宽度百分比
												} ]

											} ]

								},{
									border : false,
									layout : 'column',
									items : [  {
										labelWidth : 60, // 标签宽度
										columnWidth : .13,
										defaultType : 'textfield',
										layout : 'form',
										border : false,
										items : [ {

											id : 'windowmode',
											name : 'windowmode',
											hidden : true
										} ]
									}, 
									{
										labelWidth : 60, // 标签宽度
										columnWidth : .13,
										defaultType : 'textfield',
										layout : 'form',
										border : false,
										items : [ {

											id : 'rybh',
											name : 'rybh',
											hidden : true
										} ]	
									},
									
									{

										labelWidth : 60, // 标签宽度
										columnWidth : .23,
										defaultType : 'textfield',
										layout : 'form',
										border : false,
										items : [ {

											id : 'dqzt',
											name : 'dqzt',
											hidden : true
										} ]

									}, {
										labelWidth : 60, // 标签宽度
										columnWidth : .13,
										defaultType : 'textfield',
										layout : 'form',
										border : false,
										items : [ {
											id : 'ryid',
											name : 'ryid',
											hidden : true
										} ]

									} ]

								
									
									
								} ]
					
					});
			
			var XUELIstore = new Ext.data.Store({
				// true to clear all modified record information each
				// time the store is loaded
				pruneModifiedRecords : true,
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
				 url : 'lxy.do?reqCode=queryLxybmsqbJyForManager'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [ {
					name : 'ryid'

				}, {
					name : 'sd' // Json中的属性Key值
				}, {
					name : 'ksrq',
					type : 'date',
					dateFormat : 'Y-m-d'
				}, {
					name : 'jsrq',
					type : 'date',
					dateFormat : 'Y-m-d'
				}, {
					name : 'byyx'
				}, {
					name : 'zy'
				},{
					name:'oid'
					
				} ])
			});

			// 定义一个Record
			var XUELIRecord = Ext.data.Record.create([ {
				name : 'ryid',
				type : 'int'
			}, 
			{
				name:'oid',
				type:'int'				
			},
			{
				name : 'sd',
				type : 'int'
			}, {
				name : 'ksrq',
				type : 'data'
			}, {
				name : 'jsrq',
				type : 'data'
			}, {
				name : 'byyx',
				type : 'string'
			}, {
				name : 'zy',
				type : 'string'
			} ]);

			var XUELIsm = new Ext.grid.CheckboxSelectionModel();
			// 定义列模型
			var XUELIcm = new Ext.grid.ColumnModel([ XUELIsm, {
				dataIndex : 'ryid',
				hidden : true
			},
			{
				dataIndex : 'oid',
				hidden : true
				
			},
			{
				header : '阶段', // 列标题
				dataIndex : 'sd' // 数据索引:和Store模型对应
				
				// sortable : true
			// 是否可排序
			}, {
				header : '开始日期',
				dataIndex : 'ksrq',
				renderer : Ext.util.Format.dateRenderer('Y-m-d'),
				
				width : 200
			}, {
				header : '结束日期',
				dataIndex : 'jsrq',
				renderer : Ext.util.Format.dateRenderer('Y-m-d')
				
			}, {
				header : '毕业学校',
				dataIndex : 'byyx'
				
			}, {
				header : '专业',
				dataIndex : 'zy',
				
				width : 60
			} ]);

			// 表格实例
			var XUELIgrid = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
			
				height : 335,
				width:644,
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				margins : '3 3 3 3',
				store : XUELIstore, // 数据存储
				stripeRows : true, // 斑马线
				cm : XUELIcm, // 列模型
				sm : XUELIsm,
				
				clicksToEdit : 1, // 单击、双击进入编辑状态
				/*
				 * viewConfig : { // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况 forceFit :
				 * true },
				 */
				loadMask : {
					msg : '正在加载数据,请稍等...'
				}
			});
             // 学历的分页
			var XUELIpagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				XUELIstore : new Ext.data.ArrayStore({
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
			var XUELInumber = parseInt(XUELIpagesize_combo.getValue());
			XUELIpagesize_combo.on("select", function(comboBox) {
				XUELIbbar.pageSize = parseInt(comboBox.getValue());
				XUELInumber = parseInt(comboBox.getValue());
				XUELIstore.reload({
					params : {
						start : 0,
						limit : XUELIbbar.pageSize
					}
				});
			});

			var XUELIbbar = new Ext.PagingToolbar({
				pageSize : number,
				store : XUELIstore,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', XUELIpagesize_combo ]
			});
			// 学历的分页结束
			
			
			// 学历信息end

			// 工作经历start

			var GZsm = new Ext.grid.CheckboxSelectionModel();
			// 定义列模型
			var GZcm = new Ext.grid.ColumnModel([ GZsm, {
				dataIndex : 'ryid',
				hidden : true
			}, 
			{
				dataIndex : 'oid',
				hidden : true
							
			},
			{
				header : '开始日期',
				dataIndex : 'ksrq',					
				width : 100
			}, {
				header : '结束日期',
				dataIndex : 'jsrq',				
				width : 100
			}, {
				header : '工作单位',
				dataIndex : 'gzdw',
				width : 80
			}, {
				header : '职务',
				dataIndex : 'zw',				
				width : 60
			}, {
				header : '薪资',
				dataIndex : 'xz',				
				width : 60
			}, {
				header : '扣缴何种保险',
				dataIndex : 'kjbx',				
				width : 100
			}, {
				header : '合同期限',
				dataIndex : 'htqx',				
				width : 60
			}, {
				header : '离职原因',
				dataIndex : 'lzyy',				
				width : 100
			}, {
				header : '证明人',
				dataIndex : 'zmr',				
				width : 60
			}, {
				header : '证明人职务',
				dataIndex : 'zmrzw',				
				width : 110
			} ]);

			/**
			 * 数据存储
			 */
			var GZstore = new Ext.data.Store({
				// true to clear all modified record information each
				// time the store is loaded
				pruneModifiedRecords : true,
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
				 url : 'lxy.do?reqCode=queryLxybmsqbWbForManager'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [ {
					name : 'ryid'

				},				
				{name:'oid'					
				},{
					name : 'ksrq'
					// type : 'date'
					// dateFormat : 'Y-m-d'
				}, {
					name : 'jsrq'
				// type : 'date'
					// dateFormat : 'Y-m-d'
				}, {
					name : 'gzdw'
				}, {
					name : 'zw'
				}, {
					name : 'xz'
				}, {
					name : 'kjbx'
				}, {
					name : 'htqx'
				}, {
					name : 'lzyy'
				}, {
					name : 'zmr'
				}, {
					name : 'zmrzw'
				} ])
			});

			// 定义一个Record
			var GZRecord = Ext.data.Record.create([ {
				name : 'ryid',
				type : 'int'
			}, 
			{
				name:'oid',
				type:'int'				
			},
			{
				name : 'ksrq',
				type : 'data'
			}, {
				name : 'jsrq',
				type : 'data'
			}, {
				name : 'gzdw',
				type : 'string'
			}, {
				name : 'zw',
				type : 'string'
			}, {
				name : 'xz',
				type : 'string'
			}, {
				name : 'kjbx',
				type : 'string'
			}, {
				name : 'htqx',
				type : 'string'
			}, {
				name : 'lzyy',
				type : 'string'
			}, {
				name : 'zmr',
				type : 'string'
			}, {
				name : 'zmrzw',
				type : 'string'
			} ]);

		
			// 表格实例
			var GZgrid = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				
				height : 335,
				/* width:650, */
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				margins : '3 3 3 3',
				store : GZstore, // 数据存储
				stripeRows : true, // 斑马线
				cm : GZcm, // 列模型
				sm : GZsm,			
				clicksToEdit : 1, // 单击、双击进入编辑状态
				/*
				 * viewConfig : { // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况 forceFit :
				 * false },
				 */
				loadMask : {
					msg : '正在加载数据,请稍等...'
				}
			});


			var GZpagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				GZstore : new Ext.data.ArrayStore({
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
			var GZnumber = parseInt(GZpagesize_combo.getValue());
			GZpagesize_combo.on("select", function(comboBox) {
				GZbbar.pageSize = parseInt(comboBox.getValue());
				GZnumber = parseInt(comboBox.getValue());
				GZstore.reload({
					params : {
						start : 0,
						limit : GZbbar.pageSize
					}
				});
			});

			var GZbbar = new Ext.PagingToolbar({
				pageSize : number,
				store : XUELIstore,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', GZpagesize_combo ]
			});	
			
			

			// 工作经历end
			
			
			
			// 家庭成员start
			
			var JJsm = new Ext.grid.CheckboxSelectionModel();
			// 定义列模型
			var JJcm = new Ext.grid.ColumnModel([ JJsm, {
				dataIndex : 'ryid',
				hidden : true
			}, 
			{
				dataIndex : 'oid',
				hidden : true
							
			},
			
			{
				header : '与本人关系',
				dataIndex : 'jjybrgx',					
				width : 100
			}, {
				header : '姓名',
				dataIndex : 'jjxm',				
				width : 60
			}, {
				header : '身份证号',
				dataIndex : 'jjsfzh',
				width : 180
			}, {
				header : '出生日期',
				dataIndex : 'jjcsrq',				
				width : 100
			}, {
				header : '工作单位',
				dataIndex : 'jjdw',				
				width : 100
			},
			{
				header:'联系方式',
				dataIndex:"jjlxfs",
				width:120
				
				
			},
			{
				header : '现住址',
				dataIndex : 'jjxzz',				
				width : 180
			} ]);

			/**
			 * 数据存储
			 */
			var JJstore = new Ext.data.Store({
				// true to clear all modified record information each
				// time the store is loaded
				pruneModifiedRecords : true,
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
				 url : 'lxy.do?reqCode=queryLxybmsqbJJForManager'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [ {
					name : 'ryid'

				},				
				{
					name:'oid'					
				},{
					name : 'jjxm'
					// type : 'date'
					// dateFormat : 'Y-m-d'
				}, {
					name : 'jjdw'
				// type : 'date'
					// dateFormat : 'Y-m-d'
				}, {
					name : 'jjcsrq'
				}, {
					name : 'jjxzz'
				}, {
					name : 'jjybrgx'
				}, {
					name : 'jjsfzh'
				},{
					name:'jjlxfs'
					
				}])
			});
			
			

			// 表格实例
			var JJgrid = new Ext.grid.GridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				
				height : 335,
				/* width:650, */
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				margins : '3 3 3 3',
				store : JJstore, // 数据存储
				stripeRows : true, // 斑马线
				cm : JJcm, // 列模型
				sm : JJsm,
			
				clicksToEdit : 1, // 单击、双击进入编辑状态
				/*
				 * viewConfig : { // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况 forceFit :
				 * false },
				 */
				loadMask : {
					msg : '正在加载数据,请稍等...'
				}
			});


			var JJpagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				JJstore : new Ext.data.ArrayStore({
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
			var JJnumber = parseInt(JJpagesize_combo.getValue());
			JJpagesize_combo.on("select", function(comboBox) {
				JJbbar.pageSize = parseInt(comboBox.getValue());
				JJnumber = parseInt(comboBox.getValue());
				JJstore.reload({
					params : {
						start : 0,
						limit : JJbbar.pageSize
					}
				});
			});

			var JJbbar = new Ext.PagingToolbar({
				pageSize : number,
				store : JJstore,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', JJpagesize_combo ]
			});	
			
			
			
			// 家庭成员end
			
			
            //查看历史星级
			
			var xjsm = new Ext.grid.CheckboxSelectionModel();
			// 定义列模型
			var xjcm = new Ext.grid.ColumnModel([ xjsm, {
				dataIndex : 'ryid',
				hidden : true
			}, {
				dataIndex : 'hr_eventid',
				hidden : true

			}, {
				header : '部门',
				dataIndex : 'deptname'
			}, {
				header : "姓名",
				dataIndex : 'xm'
			}, {
				header : '星级', // 列标题
				dataIndex : 'xygxj', // 数据索引:和Store模型对应
				renderer : YGXJRender
			// sortable : true
			// 是否可排序
			}, {
				header : '获取星级时间',
				dataIndex : 'xhqxjrq',
				sortable : true,
				format : 'y-M-d',

				width : 200
			} ]);

			/**
			 * 数据存储
			 */
			var xjstore = new Ext.data.Store({
				// true to clear all modified record information each
				// time the store is loaded
				pruneModifiedRecords : true,
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : 'lxycsh.do?reqCode=queryLxybdjlxj'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [ {
					name : 'ryid'

				}, {
					name : 'hr_eventid' // Json中的属性Key值
				}, {
					name : 'xm'
				}, {
					name : 'xhqxjrq',

					dateFormat : 'Y-m-d'
				}, {
					name : 'xygxj'
				}, {
					name : 'deptname'
				} ])
			});

			

			// 表格实例
			var xjgrid = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体

				height : 335,
				width : 644,
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				margins : '3 3 3 3',
				store : xjstore, // 数据存储
				stripeRows : true, // 斑马线
				cm : xjcm, // 列模型
				sm : xjsm,
			
				clicksToEdit : 1, // 单击、双击进入编辑状态
				/*
				 * viewConfig : { // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况 forceFit :
				 * true },
				 */
				loadMask : {
					msg : '正在加载数据,请稍等...'
				}
			});
			// 学历的分页
			var xjpagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				xjstore : new Ext.data.ArrayStore({
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
			var xjnumber = parseInt(xjpagesize_combo.getValue());
			xjpagesize_combo.on("select", function(comboBox) {
				xjbbar.pageSize = parseInt(comboBox.getValue());
				xjnumber = parseInt(comboBox.getValue());
				xjstore.reload({
					params : {
						start : 0,
						limit : xjbbar.pageSize
					}
				});
			});

			var xjbbar = new Ext.PagingToolbar({
				pageSize : number,
				store : xjstore,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', xjpagesize_combo ]
			});
			//查看历史星级
			
			
			
			
			
			var tabs = new Ext.TabPanel({
				region : 'center',
				margins : '3 3 3 3',
				enableTabScroll : true,
				autoWidth : true

			});
			// 每一个Tab都可以看作为一个Panel
			tabs.add({
				title : '<span class="commoncss">基本信息</span>',
				id : 'tab1',
			
				items : [ addUserForm ]
		
			});

			tabs.add({
				id : 'tab2',
				title : '<span class="commoncss">学历信息</span>',
				items : [ XUELIgrid ]
			});
			tabs.add({
				id : 'tab3',
				title : '<span class="commoncss">工作简历</span>',
				items : [ GZgrid ]
			});
			tabs.add({
				id:'tab4',
				title:'<span class="commoncss">家庭成员</span>',
				items:[JJgrid]
			});
			
			tabs.add({
				id:'tab5',
				title:'<span class="commoncss">查看历史星级</span>',
				items:[xjgrid]
			});
			tabs.activate(0);
			

			var addUserWindow = new Ext.Window({
				name:'addUserWindow',
				id:'addUserWindow',
				layout : 'fit',
				width : 650,
				height : 430,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				modal : true,
			
				// iconCls : 'page_addIcon',
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				pageY : 20,
				pageX : document.body.clientWidth / 2 - 520 / 2,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [ tabs ],
				buttons : [
				
				{
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						addUserWindow.hide();
						addUserForm.getForm().getEl().dom.reset();
					}
				}
				]
			});
			

			

			
		});