Ext
		.onReady(function() {
			var ryid, deptid;
			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel([  sm,new Ext.grid.RowNumberer({header:'NO',width:28}),
					{
						hidden : true,
						header : '人员ID',
						dataIndex : 'ryid',
						width : 35
					}, {
						header : '人员编码',
						dataIndex : 'rybh',
						sortable : true,
						width : 90
					}, {
						header : '姓名',
						dataIndex : 'xm',
						sortable : true,
						width : 60
					},
					{

						header : '部门编码',
						dataIndex : 'deptid',
						sortable : true,
						width : 80
						
					},
					{
						header : '部门名称',
						dataIndex : 'deptname',
						sortable : true,
						width : 100	
					},
					
					{
						header : '岗位',
						dataIndex : 'gw',
						sortable : true,
						width : 80,
						renderer:GWRender
						
					},
					{
						header : '性别',
						dataIndex : 'xb',
						width : 40,
						renderer : XBRender
					}, {
						header : '出生日期',
						dataIndex : 'csrq',					
						sortable : true,
						width : 120
					}, {

						header : '供应商',
						dataIndex : 'ghdw',					
						sortable : true,
						width : 100
						
					},
					{

						header : '品牌',
						dataIndex : 'pp',					
						sortable : true,
						width : 100
						
					},
					
					{
						header : '入企时间',
						dataIndex : 'ydrq',					
						sortable : true,
						width : 100					
						
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
						width : 60,
						renderer : HYZKRender
					}, {
						header : '最高学历',
						dataIndex : 'zgxl',
						sortable : true,
						width : 60

					}, {
						header : '学历性质',
						dataIndex : 'xlxz',
						sortable : true,
						width : 60,
						renderer : XLXZRender
					}, {
						id : 'JZFS',
						header : '居住方式',
						dataIndex : 'jzfs',
						width : 60,
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
						width : 80
					}, {
						
						header : '紧急联系人手机',
						sortable : true,
						dataIndex : 'jjlxrsj',
						width : 120
					}, {

						header : '当前状态',
						sortable : true,
						dataIndex : 'dqzt',
						width : 80,
						renderer : DQZTRender
					},{
						header:'填表时间',
						sortable:true,
						dataIndex:'jdrq',
						width:100
					},{
						header:'建档人',
						sortable:true,
						dataIndex:'jdrm',
						width:100
						
					}]);
			
			

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : './lxybd.do?reqCode=querybmLxyxxwhForManager'
				}),
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'ryid'
				}, {
					name : 'rybh'
				}, {
					name : 'xm'
				}, {
					name : 'fullname'
				}, {
					name : 'xb'
				}, {
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
					name : 'xlxz'
				}, {
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
					
					name:'jdrm'
				},{
					name:'jdrq'
					
				},{
					name:'deptid'
					
				},{
					name:'deptname'
				},{
					name:'ghdw'
					
				},{
					name:'pp'
				},{
					name:'gw'
				},{
					name:'ydrq'
					
				} ])
			});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams =queryUserFormPanel.getForm().getValues() ;
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
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
			});

			var grid = new Ext.grid.GridPanel({

				title : '<span class="commoncss">人员信息表</span>',
				
				autoScroll : true,
				region : 'center',
				margins : '3 3 3 3',
				store : store,
				loadMask : {
					msg : '正在加载数据,请稍等...'
				},
				stripeRows : true,
				frame : true,

				cm : cm,
				sm : sm,
				tbar : [  {
					text : '修改',
					iconCls : 'page_edit_1Icon',
					id:'lxybmInitUpdate',
					handler : function() {
						Ext.getCmp('adduserReset').hide();
						editInit();
					}
				}/*
					 * , '-', { text : '查询', iconCls : 'previewIcon',
					 * id:'lxybmInitSelect', handler : function() { queryUser(); } }
					 * ,'-',{
					 * 
					 * text : '批量添加', iconCls : 'page_excelIcon',
					 * //id:'lxybmInitSelect', handler : function() {
					 * LxyinfoBatch(); } }
					 */],
				bbar : bbar
			});
			// 监听行双击事件
			grid.on('rowdblclick', function(pGrid, rowIndex, event) {				
				editInit();
			});
			
			
			
			// 给需要提示的输入框付提示语
			function setempty(){
				var jzmj=Ext.getCmp('jzmj');
				jzmj.emptyText='单位是平方米';
				jzmj.setRawValue(jzmj.emptyText);
				
				var sg=Ext.getCmp('sg');
				sg.emptyText='单位cm';
				sg.setRawValue(sg.emptyText);
				
				var tz=Ext.getCmp('tz');
				tz.emptyText='单位kg';
				tz.setRawValue(tz.emptyText);
				
				var lt=Ext.getCmp('lt');
				lt.emptyText='上班方式';
				lt.setRawValue(lt.emptyText);
				
			}
			
			

			/**
			 * 修改人员初始化
			 */
			function editInit() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
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
				addUserWindow.setTitle('<span class="commoncss">修改部门联销员信息</span>');
				Ext.getCmp('windowmode').setValue('update');
				ryid = record.get('ryid');
				deptid = record.get('deptid');
				Ext.getCmp('ryid').setValue(record.get('ryid'));
				tabs.activate(0);
				Ext.getCmp('addformsave').show();
				Ext.getCmp('adduserReset').show();
				
			}

			
			// 添加人员star
			var XBCombo = new Ext.form.ComboBox({
				id:'ryxb',
				name : 'xb',
				hiddenName : 'xb',
				store : XBStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				// value : '0',
				fieldLabel : '性别',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});

			var HYZKCombo = new Ext.form.ComboBox({
				name : 'hyzk',
				// id : 'hyzk',
				hiddenName : 'hyzk',
				store : HYZKStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				// value : '0',
				fieldLabel : '婚姻状态',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});

			var JZFSCombo = new Ext.form.ComboBox({
				name : 'jzfs',
				// id : 'jzfs',
				hiddenName : 'jzfs',
				store : JZFSStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				// value : '0',
				fieldLabel : '居住方式',
				emptyText : '请选择...',
				// labelStyle : micolor,
				// allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});

			var XLXZCombo = new Ext.form.ComboBox({
				name : 'xlxz',
				// id : 'xlxz',
				hiddenName : 'xlxz',
				store : XLXZStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				// value : '0',
				fieldLabel : '学历性质',
				emptyText : '请选择...',
				// labelStyle : micolor,
				// allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});

			var HKXZCombo = new Ext.form.ComboBox({
				name : 'hkxz',
				// id : 'hkxz',
				hiddenName : 'hkxz',
				store : HKXZStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				// value : '0',
				fieldLabel : '户口性质',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});
			
			var GWCombo = new Ext.form.ComboBox({
				name : 'gw',
				// id : 'hkxz',
				hiddenName : 'gw',
				store : GWStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				// value : '0',
				fieldLabel : '岗位',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "100%"
			});
			
			// 修改部门联销员信息
			var deptEmpForm = new Ext.form.FormPanel({
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 120,
				items : [{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : .5,
								layout : 'form',
								labelWidth : 60, // 标签宽度
								defaultType : 'textfield',
								border : false,
								items : [{
											fieldLabel : '入司日期',
											name : 'ydrq',
											xtype : 'datefield',
                                            format : 'Y-m-d',
											anchor : '100%'
										}, {
											id : 'gw_ryid',
											name : 'ryid',
											hidden : true
										}]
							}, {
								columnWidth : .5,
								layout : 'form',
								labelWidth : 60, // 标签宽度
								defaultType : 'textfield',
								border : false,
								items : [GWCombo, {
									id : 'gw_deptid',
									name : 'deptid',
									hidden : true
								}]
							}]
				}],
				tbar : [{
					text : '保存',
					iconCls : 'acceptIcon',
					handler : function() {
						saveLxygwInfo();
					}
				}, {
					text : '重置',
					iconCls : 'tbar_synchronizeIcon', handler :
						  function() {}					
				}]
			});
			

			var addUserForm = new Ext.form.FormPanel(
					{
						// frame : true, //是否渲染表单面板背景色
						//region:'north',
						//labelAlign : 'right', // 标签对齐方式
						//margins : '3 3 3 3',
						//bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
						//border:true,
						//collapsible:true,
						// width:645,
						border : false,
						labelWidth : 60, // 标签宽度
						labelAlign : 'right', // 标签对齐方式
						bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
						buttonAlign : 'center',
						height : 120,
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
											readOnly:true,
											id:'addusersfzh',
											regex : /^(\d{18,18}|\d{15,15}|\d{17,17}X)$/,
											maxLength : 18, // 可输入的最大文本长度,不区分中英文字符
											allowBlank : false,
											labelStyle : 'color:blue;',
											enableKeyEvents : true,
											listeners : {
												specialkey : function(field, e) {
													if (e.getKey() == Ext.EventObject.ENTER) {
														loadbirthday();// 通过身份证号获取出生日期和性别
													}
												}
											},
											anchor : '99%'// 宽度百分比
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
											labelStyle : 'color:blue;',
											fieldLabel : '姓名', // 标签
											id : 'xm',
											name : 'xm', // name:后台根据此name属性取值
											maxLength : 6, // 可输入的最大文本长度,不区分中英文字符
											allowBlank : false,

											anchor : '100%'// 宽度百分比
										}, {

											xtype : 'numberfield', // 设置为数字输入框类型
											emptyText :'单位是cm',
											fieldLabel : '身高', // 标签
											name : 'sg', // name:后台根据此name属性取值
											id : 'sg',
											// allowBlank : false,
											// labelStyle : 'color:blue;',
											maxLength : 7, // 可输入的最大文本长度,不区分中英文字符
											anchor : '100%'// 宽度百分比
										}, {
											fieldLabel : '出生地',
											name : 'csd',
											id : 'csd',
											anchor : '100%'
										}, {
											fieldLabel : '体重', // 标签
											 emptyText:'单位是kg',
											xtype : 'numberfield',
											name : 'tz', // name:后台根据此name属性取值
											id : 'tz',
											// allowBlank : false,
											// labelStyle : 'color:blue;',
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
											allowBlank : false,
											labelStyle : 'color:blue;',
											anchor : '100%'// 宽度百分比
										}, {
											fieldLabel : '有无病史', // 标签
											name : 'ywbs', // name:后台根据此name属性取值
											id : 'ywbs',
											anchor : '100%'// 宽度百分比
										}, {
											fieldLabel : '户口地',
											// allowBlank : false,
											// labelStyle : 'color:blue;',
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
											allowBlank : false,
											labelStyle : 'color:blue;',
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
													allowBlank : false,
													labelStyle : 'color:blue;',

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
													emptyText:'单位是平方米',
													// allowBlank : false,
													// labelStyle :
													// 'color:blue;',
													// blankText:'单位是平方米',
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
											// allowBlank : false,
											// labelStyle : 'color:blue;',
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
													labelStyle : 'color:blue',
													maxLength : 18, // 可输入的最大文本长度,不区分中英文字符
													allowBlank : false,

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
													allowBlank : false,
													labelStyle : 'color:blue',
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

								
									
									
								} ],
						tbar : [ {
							text : '保存',
							iconCls : 'acceptIcon',
							id:'addformsave',
							handler : function() {

								if (runMode == '0') {
									Ext.Msg
											.alert('提示',
													'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
									return;
								}
								var mode = Ext.getCmp('windowmode').getValue();
								// Ext.MessageBox.alert('提示', mode);
								if (mode == 'add'&&ryid=="")
									saveUserItem();
								else
									updateUserItem();

							}
						} ,{
							text : '重新加载',
							id : 'adduserReset', 
							iconCls : 'tbar_synchronizeIcon', handler :
								  function() {
								addUserForm.getForm().getEl().dom.reset();
								Ext.getCmp('addformsave').show();
								Ext.getCmp('adduserReset').show();
								  setempty();
								  Ext.getCmp('windowmode') .setValue('add'); 
								  Ext.getCmp('ryid').setValue(ryid);
								  Ext.getCmp('dqzt').setValue(1);
								  }
							
						}]

					});

			// 通过身份证号获取出生日期和性别
			function loadbirthday(){
				var idcard=Ext.getCmp("addusersfzh").getValue();
				Ext.Ajax.request({
					url : 'empl.do?reqCode=queryInfoByIDCard',
					success : function(response) {
						// Ext.Msg.alert(response);
					var resultArray = Ext.util.JSON.decode(response.responseText);
						if(resultArray.success){
							Ext.getCmp("csrq").setValue(resultArray.birthday);
							Ext.getCmp("ryxb").setValue(resultArray.sex);
							Ext.getCmp('addformsave').show();
						}else{							
							Ext.Msg.alert('提示', resultArray.msg);
							Ext.getCmp('addformsave').hide();
						}
						// Ext.Msg.alert('提示',
						// resultArray.msg+",出生日期："+resultArray.birthday+",性别："+resultArray.sex);
					},
					failure : function(response) {
						// Ext.Msg.alert(response);
						var resultArray = Ext.util.JSON.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
					},
					params : {
						idcard : idcard,
						ryid:Ext.getCmp("ryid").getValue()
					}
				});
				
				
			}
			
			
			// 学历信息start
			var SDstore = new Ext.data.SimpleStore({
				fields : [ 'name', 'code' ],
				data : [ [ '小学', '1' ], [ '初中', '2' ], [ '高中', '3' ],
						[ '大学', '4' ] ]
			});
			var SDCombox = new Ext.form.ComboBox({

				emptyText : '--请选择--',
				triggerAction : 'all',
				store : SDstore,
				allowBlank : false,
				displayField : 'name',
				valueField : 'code',
				mode : 'local',
				listWidth : 120, // 下拉列表的宽度,默认为下拉选择框的宽度
				forceSelection : false,
				typeAhead : true,
				/* value : '0002', */
				resizable : true,
				editable : false,
				anchor : '100%'

			});

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
				// renderer : Ext.util.Format.dateRenderer('Y-m-d'),
				
				width : 200
			}, {
				header : '结束日期',
				dataIndex : 'jsrq'
				// renderer : Ext.util.Format.dateRenderer('Y-m-d')
				
			}, {
				header : '毕业学校',
				dataIndex : 'byyx'
				
			}, {
				header : '专业',
				dataIndex : 'zy',
				
				width : 60
			} ]);

			/**
			 * 数据存储
			 */
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
					name : 'ksrq'
					// type : 'date',
					// dateFormat : 'Y-m-d'
				}, {
					name : 'jsrq'
				// type : 'date',
					// dateFormat : 'Y-m-d'
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

			// 表格工具栏
			var XUELItbar = new Ext.Toolbar({
				items : [
						{
							text : '新增一行',
							iconCls : 'addIcon',
							handler : function() {
								addJyInit();	
							}
						},
						{
							text : '修改',
							iconCls : 'page_edit_1Icon',
							handler : function() {
								XUELIupdate();
							}
						},
						{
							text : '删除数据',
							iconCls : 'deleteIcon',
							handler : function() {
								deleteUserJyItem();	
							}
						} ]
			});

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
				tbar : XUELItbar, // 表格工具栏
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
			
			// 监听行双击事件
			XUELIgrid.on('rowdblclick', function(pGrid, rowIndex, event) {
				// 获取行数据集
				var record = pGrid.getStore().getAt(rowIndex);
				// 获取单元格数据集
				var data = record.get("oid");
				
				XUELIupdate();
			});
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

			
			// 表格工具栏
			var GZtbar = new Ext.Toolbar({
				items : [
						{
							text : '新增一行',
							iconCls : 'addIcon',
							handler : function() {
								// var row = new GZRecord({});
								// row.set('qybz', '1'); // 赋初值
								addGZInit();
								// addLxyGZWindow.show();
							}
						},
						{
							text : '修改',
							iconCls : 'page_edit_1Icon',
							handler : function() {
								GZupdate();
							}
						},
						{
							text : '删除数据',
							iconCls : 'deleteIcon',
							handler : function() {
								deleteUserGZItem();	
							}
						} ]
			});

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
				tbar : GZtbar, // 表格工具栏
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
				store : GZstore,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', GZpagesize_combo ]
			});	
			
			// 监听行双击事件
			GZgrid.on('rowdblclick', function(pGrid, rowIndex, event) {
				// 获取行数据集
				GZupdate();
				
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
			// 定义一个Record
			var GZRecord = Ext.data.Record.create([ {
				name : 'ryid',
				type : 'int'
			}, {
				name:'oid',
				type:'int'
			},{
				name:'jjxm',
				type:'string'
			},{
				name:'jjdw',
				type:'string'
				
			},{
				name:'jjcsrq',
				type:'date'
			},
			{
				name:'jjxzz',
				type:'string'
			},{
				name:'jjybrgx',
				type:'string'
				
			},{
				name:'jjsfzh',
				type:'string'
			},{
				name:'jjlxfs',
				type:'string'
			}])
			// 表格工具栏
			var JJtbar = new Ext.Toolbar({
				items : [
						{
							text : '新增一行',
							iconCls : 'addIcon',
							handler : function() {
								// var row = new GZRecord({});
								// row.set('qybz', '1'); // 赋初值
								addJJInit();
								// addLxyGZWindow.show();
							}
						},
						{
							text : '修改',
							iconCls : 'page_edit_1Icon',
							handler : function() {
								JJupdate();
							}
						},
						{
							text : '删除数据',
							iconCls : 'deleteIcon',
							handler : function() {
								deleteUserJJItem();	
							}
						} ]
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
				tbar : JJtbar, // 表格工具栏
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
			
			// 监听行双击事件
			JJgrid.on('rowdblclick', function(pGrid, rowIndex, event) {
				// 获取行数据集
				JJupdate();
				
			});
			// 家庭成员end
			

			// 历史经济维护start
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

			// 表格工具栏
			var xjtbar = new Ext.Toolbar({
				items : [ {
					text : '新增一行',
					iconCls : 'addIcon',
					handler : function() {
						addxjInit();
					}
				}, {
					text : '修改',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						updatexjInit();
					}
				}, {
					text : '删除数据',
					iconCls : 'deleteIcon',
					handler : function() {
						deletexjInit();
					}
				} ]
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
				tbar : xjtbar, // 表格工具栏
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
			// 学历的分页结束

			// 监听行双击事件
			xjgrid.on('rowdblclick', function(pGrid, rowIndex, event) {
				updatexjInit();
			});
			
			var YGXJCombo1 = new Ext.form.ComboBox({
				name : 'xygxj',
				// id:'xjwhygxj',
				hiddenName : 'xygxj',
				store : YGXJStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '',
				fieldLabel : '星级选择',
				emptyText : '请选择...',
				forceSelection : true,
				editable : false,
				allowBlank : false,
				typeAhead : true,
				labelStyle : micolor,
				anchor : "100%"
			});
			
			
			var xjwhForm = new Ext.form.FormPanel({
				id : 'xjwhForm',
				name : 'xjwhForm',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 85,
				frame : false,
				margins : '3 3 3 3',
				bodyStyle : 'padding:5 5 5 5',
				items : [ YGXJCombo1, {
				// / id:'xjwhhqxjrq',
					fieldLabel : '获取星级时间', // 标签
					xtype : 'datefield',
					format : 'Y-m-d',
					name : 'xhqxjrq', // name:后台根据此name属性取值
					allowBlank : false,
					labelStyle : 'color:blue;',
					anchor : '100%'// 宽度百分比
				}, {

					// fieldLabel : '人员ID', // 标签
					id : 'xjryid',
					name : 'ryid',
				    hidden : 'true'
				}, {
					// id : 'hr_eventid',
					name : 'hr_eventid',
				    hidden:'true'
				} ]

			});

			
			var addxjWindow = new Ext.Window({
				title : '<span class="commoncss">修改员工星级</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 300, // 窗口宽度
				height : 200, // 窗口高度
				closable : true, // 是否可关闭
				closeAction : 'hide', // 关闭策略
				collapsible : true, // 是否可收缩
				maximizable : false, // 设置是否可以最大化
				border : true, // 边框线设置
				constrain : true,
				titleCollapse : true,
				animateTarget : Ext.getBody(),
				pageY : 100, // 页面定位Y坐标
				pageX : document.body.clientWidth / 2 - 500 / 2, // 页面定位X坐标
				// 设置窗口是否可以溢出父容器
				buttonAlign : 'right',
				items : [ xjwhForm ],
				buttons : [ {
					text : '保存',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						savelxyxjwh();
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						xjwhForm.getForm().reset();
						addxjWindow.hide();
					}
				} ]
			});
			function addxjInit() {
				// clearForm(xjForm.getForm());
				// xjwhForm.form.reset();
				xjwhForm.getForm().reset();
				addxjWindow.setTitle('<span class="commoncss">添加员工历史星级记录</span>');
				// xjwhForm.getForm().getEl().dom.reset();
				// Ext.Msg.alert('提示','ryid:'+var_ryid);
				Ext.getCmp("xjwhForm").findById('xjryid').setValue(Ext.getCmp('ryid').getValue());
				addxjWindow.show();

			}

			function updatexjInit() {
				var record = xjgrid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.Msg.alert('提示', '请先选中要选者人员。');
					return;
				}
				// Ext.Msg.alert('提示',record.get('xygxj')+"---"+record.get("hqxjrq"));
				// addUserForm.getForm().loadRecord(record);
				xjwhForm.getForm().loadRecord(record);
				// Ext.getCmp('xjForm').findById('ryid').setValue(record.get('ryid'));
				// Ext.getCmp('xjwhForm').findById('xjwhygxj').setValue(record.get('xygxj'));
				// Ext.getCmp('xjwhForm').findById('xjwhhqxjrq').setValue(record.get('hqxjrq'));
				// Ext.getCmp('xjForm').findById('hr_eventid').setValue(record.get('hr_eventid'));
				addxjWindow.show();
			}

			function deletexjInit() {
				var record = xjgrid.getSelectionModel().getSelections();
				var strchecked = jsArray2JsString(record, "hr_eventid");
				Ext.Msg.confirm('请确认',
						'<span><b>提示:</b>删除操作不可逆,请慎重.</span><br>继续删除吗?',
						function(btn, text) {
							if (btn == 'yes'){
								
								Ext.Ajax.request({
									url : "lxycsh.do?reqCode=deletelxyxjwh",
									success : function(response) {
										var resultArray = Ext.util.JSON
												.decode(response.responseText);
										xjstore.reload();
										Ext.Msg.alert('提示', resultArray.msg);
									},
									failur : function(response) {
										var resultArray = Ext.util.JSON
												.decode(response.responseText);
										xjstore.reload();
										Ext.Msg.alert('提示', resultArray.msg);

									},
									params : {
										strchecked : strchecked
									}

								});
								
							}
							
				
				          }
				
				);
							
				
				
				
				
			}

			function savelxyxjwh() {
				if (!xjwhForm.form.isValid()) {
					return;

				}

				xjwhForm.form.submit({
					url : 'lxycsh.do?reqCode=savelxyxjwhItem',
					waitTitle : '提示',
					meothod : 'POST',
					waitMsg : '正在处理数据请稍后。。。',
					success : function(form, action) {
						// var
						// resultArray=Ext.util.JSON.decode(response.responseText);
						xjstore.reload();
						addxjWindow.hide();
						Ext.Msg.alert('提示', action.result.msg);

					},
					failure : function(form, action) {
						// var
						// resultArray=Ext.util.JSON.decode(response.responseText);
						xjstore.reload();
						addxjWindow.hide();
						Ext.Msg.alert('提示', action.result.msg);

					}

				});

			}
			
			// 历史星级维护end
			
			
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
			    layout : 'fit',
				items : [ addUserForm ]
		
			});

			tabs.add({
				id : 'tab2',
				title : '<span class="commoncss">学历信息</span>',
				items : [ XUELIgrid ]
			});
			
		
			tabs.add({
				id : 'tab4',
				title : '<span class="commoncss">工作简历</span>',
				items : [ GZgrid ]
			});		
			tabs.add({
				id : 'tab3',
				title : '<span class="commoncss">家庭成员</span>',
				items : [ JJgrid ]
			});
			
			tabs.add({
				id:'tab5',
				title:'<span class="commoncss">历史星级维护</span>',
				layout : 'fit',
				items:[xjgrid]
				
			});
			
			tabs.add({
				id:'tab6',
				title:'<span class="commoncss">岗位信息维护</span>',
				items:[deptEmpForm]
				
			});
			
			tabs.activate(0);
			tabs.on('tabchange',function(tabPanel, newCard, oldCard){
				if(newCard.id!='tab1'){
					var flag =Ext.getCmp('windowmode').getValue();
					if((ryid==null||ryid=='')&&flag=='add'){
						tabs.activate(0);						
					}else{
						if(newCard.id=='tab2'){
							var params = addUserForm.getForm().getValues();
							params.start = 0;
							params.limit = XUELIbbar.pageSize;						
							XUELIstore.load({
								params : params
							});
						}
						if(newCard.id=='tab4'){
							var params = addUserForm.getForm().getValues();
							
							params.start = 0;
							params.limit = GZbbar.pageSize;						
							GZstore.load({
								params : params
							});
							
						}
						
						if(newCard.id=='tab3'){
							var params =addUserForm.getForm().getValues();
							params.start=0;
							params.limit=JJbbar.pageSize;
							JJstore.load({
								params:params
								
							});
						}
						
						if(newCard.id=='tab5'){
							var params =addUserForm.getForm().getValues();
							params.start=0;
							params.limit=xjbbar.pageSize;
							xjstore.load({
								params:params
							});				
						}
						
						// 岗位信息维护--徐岩
						if(newCard.id=='tab6'){
							deptEmpFormloadCallBack();							
						}						
						
					}
					
				}
				
				function deptEmpFormloadCallBack() {
					deptEmpForm.form.load({
						waitMsg : '正在读取信息',// 提示信息
						waitTitle : '提示',// 标题
						url : './lxybd.do?reqCode=queryBmlxyItemForManage',
						params : {
							deptid : deptid,
						    ryid : ryid
						},
						success : function(form, action) {// 加载成功的处理函数
		
						},
						failure : function(form, action) {// 加载失败的处理函数
							Ext.Msg.alert('提示', '数据读取失败:' + action.failureType);
						}
					});
				}
				
				
				
			
			
				
				
				
			});
			
			var DQZTCombo = new Ext.form.ComboBox({
				name : 'dqzt',
				
				hiddenName : 'DQZT',
				store : DQZTStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '',
				fieldLabel : '当前状态',
				emptyText : '请选择...',
				
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "90%"
			});
			

			// 添加人员end
			
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

			// 监听下拉树的节点单击事件
			addDeptTree.on('click', function(node) {
				comboxWithTree.setValue(node.text);
				Ext.getCmp("queryUserFormPanel").findById('deptid').setValue(
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
						// allowBlank : false,
						// labelStyle : 'color:blue',
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
			
			var queryUserFormPanel = new Ext.form.FormPanel({
					id : 'queryUserFormPanel',
					name : 'queryUserFormPanel',
					height : 125,
					collapsible : true,
					labelAlign : 'right',
					region : 'north',
					buttonAlign : 'center',
					labelWidth : 70,
					frame : false,
					bodyStyle : 'padding:5 5 0',
				items : [ {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .33,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '姓名',
							name : 'xm',
							xtype : 'textfield', // 设置为数字输入框类型
							anchor : '100%'
						},comboxWithTree]
					}, {
						columnWidth : .33,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '身份证号', // 标签
							name : 'sfzh', // name:后台根据此name属性取值
							anchor : '100%' // 宽度百分比
						}, {
							fieldLabel : '电话号', // 标签
						
							name : 'lxsj', // name:后台根据此name属性取值
						
							
							anchor : '100%' // 宽度百分比
						}]
					}, {
						columnWidth : .33,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {

							fieldLabel : '厂商名称', // 标签
							name : 'ghdw', // name:后台根据此name属性取值
							anchor : '100%'// 宽度百分比

						},{

							fieldLabel : '品牌名称', // 标签
							name : 'pp', // name:后台根据此name属性取值
							anchor : '100%'// 宽度百分比

						} ]
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
					id:'lxyxxSelect_select',
					handler : function() {
						queryLxyManger();
					}
				}, {
					text : '重置',
					id:'lxyxxSelect_reset',
					iconCls : 'tbar_synchronizeIcon',
					handler : function() {
						queryUserFormPanel.getForm().reset();
					}
				} ]
			});
			
			
			

		
			var addUserWindow = new Ext.Window({
				layout : 'fit',
				width : 650,
				height : 430,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				modal : true,
				title : '<span class="commoncss">新增人员</span>',
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
						// addUserForm.getForm().getEl().dom.reset();
					}
				}
				]
			});
			
			function saveLxygwInfo(){
				if(!deptEmpForm.form.isValid()){
					return;
				}
				
				deptEmpForm.form.submit({
					url : 'lxybd.do?reqCode=updateBmlxyItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据，请稍候...',
					success : function(form, action) {
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '人员数据保存失败:<br>');
					}
				});
			}
			
			/**
			 * 保存人员数据
			 */
			function saveUserItem() {

				if (!addUserForm.form.isValid()) {
					return;
				}
				var thisForm=addUserForm.getForm();
				if(thisForm.isValid()){
					var submitValues=addUserForm.getForm().getValues();
					for(var param in submitValues){
						if(thisForm.findField(param)&&thisForm.findField(param).emptyText==submitValues[param]){
							submitValues[param]='';
							
						}
						
					}
				}
				addUserForm.form.submit({
					
					url : 'lxy.do?reqCode=saveLxybmsqbItem',
					waitTitle : '提示',					
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {	
						ryid=action.result.ryid;
						Ext.getCmp('windowmode').setValue('update');
						Ext.getCmp('ryid').setValue(ryid);
						Ext.MessageBox.alert('提示', action.result.msg);
						store.reload();
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '人员数据保存失败:<br>');
					}
				});	
				
				
			}
			

			/**
			 * 修改人员数据
			 */
			function updateUserItem() {
				if (!addUserForm.form.isValid()) {
					return;
				}
				update();
			}

			/**
			 * 更新
			 */
			function update() {
				addUserForm.form.submit({
					submitEmptyText:false,
					url : 'lxy.do?reqCode=updateLxybmsqbItem',
					waitTitle : '提示',
					method : 'POST',					
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						// addUserWindow.hide();
						store.reload();
						// form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '修改失败:<br>' + msg);
					}
				});
			}
			function queryLxyManger() {
				var params = queryUserFormPanel.getForm().getValues();
				params.start = 0;
				params.limit = bbar.pageSize;

				
				store.load({
					params : params
				});

			}

			// 徐岩修改：增加明细数据改为弹出窗口
			var JyForm = new Ext.form.FormPanel({
				id : 'JyForm',
				name : 'JyForm',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 60,
				frame : false,
				margins : '3 3 3 3',
				bodyStyle : 'padding:5 5 5 5',
				items : [ {
					name : 'sd',
					anchor:'95%',
					fieldLabel : '教育阶段'
				}, {
					name : 'ksrq',
					xtype : 'datefield',
					fieldLabel : '开始日期',
					format : 'Y-m-d',
					anchor:'95%',
					allowBlank : false,
					labelStyle : 'color:blue;'
				}, {
					name : 'jsrq',
					xtype : 'datefield',
					fieldLabel : '结束日期',
					anchor:'95%',
					format : 'Y-m-d',
					allowBlank : false,
					labelStyle : 'color:blue;'
				}, {
					name : 'byyx',
					anchor:'95%',
					fieldLabel : '毕业院校'
				}, {
					name : 'zy',
					anchor:'95%',
					fieldLabel : '专业'
				}, {
					id : 'Jyryid',
					name : 'ryid',
					anchor:'95%',
					hidden : true
				}, {
					id : 'jyoid',
					name : 'oid',
					anchor:'95%',
					hidden : true
				}, {
					id : 'jyupmode',
					name : 'jyupmode',
					hidden : true
				} ]

			});

			var addLxyJyWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 300,
						height : 300,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增联销员教育经历</span>',
						// iconCls : 'page_addIcon',
						collapsible : true,
						titleCollapse : true,
						maximizable : false,
						buttonAlign : 'right',
						border : false,
						animCollapse : true,
						pageY : 20,
						pageX : document.body.clientWidth / 2 - 420 / 2,
						animateTarget : Ext.getBody(),
						constrain : true,
						items : [ JyForm ],
						buttons : [
								{
									text : '保存',
									iconCls : 'acceptIcon',
									handler : function() {
										if (runMode == '0') {
											Ext.Msg
													.alert('提示',
															'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
											return;
										}
									
										var mode = Ext.getCmp('jyupmode')
												.getValue();
									
										if (mode == 'add')
											saveLxyJyItem();
										else
											updateLxyJyItem();
									}
								},  {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {										
										addLxyJyWindow.hide();
									}
								} ]
					});

			function addJyInit() {
				
				var flag = Ext.getCmp('jyupmode').getValue();
				if (typeof (flag) != 'undefined') {
					JyForm.getForm().getEl().dom.reset();
				} /*
					 * else { clearForm(JyForm.getForm()); }
					 */
				Ext.getCmp('Jyryid').setValue(Ext.getCmp('ryid').getValue());
			// Ext.Msg.alert('提示',Ext.getCmp('Jyryid').getValue());
				addLxyJyWindow.show();
				addLxyJyWindow.setTitle('<span class="commoncss">新增联销员教育经历</span>');
				Ext.getCmp('jyupmode').setValue('add');
			}

			function XUELIupdate(){
				var record=XUELIgrid.getSelectionModel().getSelected();
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
				JyForm.getForm().loadRecord(record);
				// addUserForm.getForm().getEl().dom.reset();
				// usertypeCombo.setReadOnly(true);
				addLxyJyWindow.show();
				addLxyJyWindow.setTitle('<span class="commoncss">修改学历信息</span>');
				// clearForm(addUserForm.getForm());
				Ext.getCmp('jyupmode').setValue('update');	
				
			}
			function saveLxyJyItem(){
				Ext.Msg.alert('提示',"jyadd");
				if (!JyForm.form.isValid()) {
					return;
				}

				JyForm.form.submit({
					url : 'lxy.do?reqCode=saveLxybmsqbJyItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						// addUserWindow.hide();
						// XUELIstore.load();
						var params = addUserForm.getForm().getValues();
						params.start = 0;
						params.limit = XUELIbbar.pageSize;						
						XUELIstore.load({
							params : params
						});
						
						// form.reset();
						JyForm.getForm().getEl().dom.reset();
						Ext.MessageBox.alert('提示', action.result.msg);	
						Ext.getCmp('jyupmode').setValue('add');
						Ext.getCmp('Jyryid').setValue(Ext.getCmp('ryid').getValue());
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '人员数据保存失败:<br>' + msg);
					}
				});
			
				
			}
			
			function updateLxyJyItem(){
				
				if (!JyForm.form.isValid()) {
					return;
				}

				JyForm.form.submit({
					url : 'lxy.do?reqCode=saveLxybmsqbJyItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						// addUserWindow.hide();
						// XUELIstore.load();
						var params = addUserForm.getForm().getValues();
						params.start = 0;
						params.limit = XUELIbbar.pageSize;						
						XUELIstore.load({
							params : params
						});				
						JyForm.getForm().getEl().dom.reset();
						addLxyJyWindow.hide();
						
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '人员数据修改失败:<br>' + msg);
					}
				});
				
				
			}
			function deleteUserJyItem(){

				var rows = XUELIgrid.getSelectionModel().getSelections();
				var fields = '';
				/*
				 * for (var i = 0; i < rows.length; i++) { if
				 * (rows[i].get('usertype') == '3') { fields = fields +
				 * rows[i].get('username') + '<br>'; } }
				 */

				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'oid');
				Ext.Ajax.request({
					url : './lxy.do?reqCode=deleteLxybmsqbJyItem',
					success : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						XUELIstore.reload();
						Ext.Msg.alert('提示', resultArray.msg);
					},
					failure : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
					},
					params : {
						strChecked : strChecked
					}
				});
			
				
				
			}
			var GZForm = new Ext.form.FormPanel({
				id:'GZForm',
				name:'GZForm',
				labelAlign : 'right', // 标签对齐方式
				margins : '3 3 3 3',
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items:[{
					layout : 'column',
					border : false,
					items:[{

						columnWidth : .5,
						layout : 'form',
						labelWidth : 70, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '工作单位',
									name : 'gzdw',
									xtype : 'textfield', // 设置为数字输入框类型
									allowBlank : false,
									labelStyle : 'color:blue;',
									anchor : '100%'
								    
								}, {
									fieldLabel : '开始时间',
									
									name:'ksrq',
									anchor:'100%',
									xtype : 'datefield',
									format : 'Y-m-d',
									allowBlank : false,
									labelStyle : 'color:blue;'
								},{
									fieldLabel : '薪资',
									name : 'xz',
									xtype : 'textfield', // 设置为数字输入框类型
									
									anchor : '100%'
								    
								},{
									fieldLabel : '合同期限',
									name : 'htqx',
									xtype : 'textfield', // 设置为数字输入框类型
									
									anchor : '100%'
								    
								},{
									fieldLabel : '证明人',
									name : 'zmr',
									xtype : 'textfield', // 设置为数字输入框类型
									anchor : '100%'
								    
								},{
									
									id : 'gzryid',
									name : 'ryid',
									anchor:'95%',
									hidden : true				
									
								},{
									
									id : 'gzoid',
									name : 'oid',
									anchor:'95%',
									hidden : true
								
									
								}]
					},{

						columnWidth : .5,
						layout : 'form',
						labelWidth : 70, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
							fieldLabel : '职务',
							name : 'zw',
							xtype : 'textfield', // 设置为数字输入框类型
							allowBlank : false,
							labelStyle : 'color:blue;',
							anchor : '100%'
						    
						}, {
							fieldLabel : '结束时间',
							xtype : 'datefield',
							name:'jsrq',
							anchor:'100%',
							format : 'Y-m-d',
							allowBlank : false,
							labelStyle : 'color:blue;'
						},{

							fieldLabel : '扣缴保险',
							name : 'kjbx',
							xtype : 'textfield', // 设置为数字输入框类型
						
							anchor : '100%'
						    	
						},{

							fieldLabel : '离职原因',
							name : 'lzyy',
							xtype : 'textfield', // 设置为数字输入框类型
							allowBlank : false,
							labelStyle : 'color:blue;',
							anchor : '100%'
						},{
							fieldLabel : '证明人职务',
							name : 'zmrzw',
							xtype : 'textfield', // 设置为数字输入框类型
							anchor : '100%'
						},{

							id : 'gzupmode',
							name : 'gzupmode',
							hidden : true
						}]
					}]
				}]
			});
			
			var addLxyGZWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 430,
						height : 300,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增联销员工作经历</span>',
						// iconCls : 'page_addIcon',
						collapsible : true,
						titleCollapse : true,
						maximizable : false,
						buttonAlign : 'right',
						border : false,
						animCollapse : true,
						pageY : 20,
						pageX : document.body.clientWidth / 2 - 420 / 2,
						animateTarget : Ext.getBody(),
						constrain : true,
						items : [ GZForm ],
						buttons : [
								{
									text : '保存',
									iconCls : 'acceptIcon',
									handler : function() {
										if (runMode == '0') {
											Ext.Msg
													.alert('提示',
															'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
											return;
										}
									
										var mode = Ext.getCmp('gzupmode')
												.getValue();
									
										if (mode == 'add')
											saveLxyGZItem();
										else
											updateLxyGZItem();
									}
								},  {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {										
										addLxyGZWindow.hide();
									}
								} ]
					});
			

			function addGZInit() {
				
				var flag = Ext.getCmp('gzupmode').getValue();
				if (typeof (flag) != 'undefined') {
					GZForm.getForm().getEl().dom.reset();
				} /*
					 * else { clearForm(JyForm.getForm()); }
					 */
				Ext.getCmp('gzryid').setValue(Ext.getCmp('ryid').getValue());
			// Ext.Msg.alert('提示',Ext.getCmp('Jyryid').getValue());
				addLxyGZWindow.show();				
				Ext.getCmp('gzupmode').setValue('add');
			}
			function saveLxyGZItem(){
				Ext.Msg.alert('提示',"gzadd");
				if (!GZForm.form.isValid()) {
					return;
				}
				Ext.MessageBox.alert("add");
				GZForm.form.submit({
					url : 'lxy.do?reqCode=saveLxybmsqbWbItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						// addUserWindow.hide();
						// XUELIstore.load();
						/*
						 * var params = addUserForm.getForm().getValues();
						 * params.start = 0; params.limit = GZbbar.pageSize;
						 * GZstore.load({ params : params });
						 */
						GZstore.reload();
						// form.reset();
						GZForm.getForm().getEl().dom.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
						
						// clearForm(GZForm.getForm());
						Ext.getCmp('gzupmode').setValue('add');
						Ext.getCmp('gzryid').setValue(Ext.getCmp('ryid').getValue());
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '人员数据保存失败:<br>' + msg);
					}
				});
				
				
			}
			function updateLxyGZItem(){
				
				if (!GZForm.form.isValid()) {
					return;
				}
				Ext.MessageBox.alert("update");
				GZForm.form.submit({
					url : 'lxy.do?reqCode=saveLxybmsqbWbItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						// addUserWindow.hide();
						// XUELIstore.load();
						var params = addUserForm.getForm().getValues();
						params.start = 0;
						params.limit = GZbbar.pageSize;						
						GZstore.load({
							params : params
						});	
						// GZForm.form().getEl().dom.reset();
						addLxyGZWindow.hide();
						
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '人员数据修改失败:<br>' + msg);
					}
				});
			}
			
			
			function GZupdate(){
				var record=GZgrid.getSelectionModel().getSelected();
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
				
				GZForm.getForm().loadRecord(record);
				// addUserForm.getForm().getEl().dom.reset();
				// usertypeCombo.setReadOnly(true);
				addLxyGZWindow.show();
				addLxyGZWindow.setTitle('<span class="commoncss">修改学历信息</span>');
				// clearForm(addUserForm.getForm());
				Ext.getCmp('gzupmode').setValue('update');	
				
			}
			function deleteUserGZItem(){

				var rows = GZgrid.getSelectionModel().getSelections();
				var fields = '';
				/*
				 * for (var i = 0; i < rows.length; i++) { if
				 * (rows[i].get('usertype') == '3') { fields = fields +
				 * rows[i].get('username') + '<br>'; } }
				 */

				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'oid');
				Ext.Ajax.request({
					url : './lxy.do?reqCode=deleteLxybmsqbWbItem',
					success : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						GZstore.reload();
						Ext.Msg.alert('提示', resultArray.msg);
					},
					failure : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
					},
					params : {
						strChecked : strChecked
					}
				});
			
				
				
			}
			
			
			// 家庭成员start
			
			
			
			
			
			
			var JJForm = new Ext.form.FormPanel({
				id:'JJForm',
				name:'JJForm',
				labelAlign : 'right', // 标签对齐方式
				margins : '3 3 3 3',
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items:[{
					layout : 'column',
					border : false,
					items:[{

						columnWidth : .9,
						layout : 'form',
						labelWidth : 70, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '与本人关系',
									name : 'jjybrgx',
									xtype : 'textfield', // 设置为数字输入框类型
									allowBlank : false,
									labelStyle : 'color:blue;',
									anchor : '100%'
								    
								}, {
									fieldLabel : '姓名',
								
									name:'jjxm',
									anchor:'100%',
									allowBlank : false,
									labelStyle : 'color:blue;'
								},{
									fieldLabel : '身份证号',
									name : 'jjsfzh',
									xtype : 'textfield', // 设置为数字输入框类型
									regex : /^(\d{18,18}|\d{15,15}|\d{17,17}X)$/,
									anchor : '100%'
								    
								},{
									fieldLabel:'联系方式',
									name:'jjlxfs',
									xtype : 'textfield', // 设置为数字输入框类型
									regex : /^(\d{7}|\d{8}|\d{11})$/,
									anchor:'100%'
									
								},{
									fieldLabel : '出生日期',
									name : 'jjcsrq',
									
									xtype : 'datefield',
									format : 'Y-m-d',
									anchor : '100%'
										
									
								}
								
								,{
									fieldLabel : '工作单位',
									name : 'jjdw',
									xtype : 'textfield', // 设置为数字输入框类型
									
									anchor : '100%'
								    
								},{
									fieldLabel : '现住址',
									name : 'jjxzz',
									xtype : 'textfield', // 设置为数字输入框类型
									anchor : '100%'
								    
								},{
									
									id : 'jjryid',
									name : 'ryid',
									anchor:'95%',
									hidden : true				
									
								},{
									name : 'oid',
									anchor:'95%',
									hidden : true
								
									
								},{
									id : 'jjupmode',
									name : 'jjupmode',
									anchor:'95%',
									hidden : true
									
								}]
					}]
				}]
			});
			
			var addLxyJJWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 300,
						height : 300,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增联销员家庭成员</span>',
						// iconCls : 'page_addIcon',
						collapsible : true,
						titleCollapse : true,
						maximizable : false,
						buttonAlign : 'right',
						border : false,
						animCollapse : true,
						pageY : 20,
						pageX : document.body.clientWidth / 2 - 420 / 2,
						animateTarget : Ext.getBody(),
						constrain : true,
						items : [ JJForm ],
						buttons : [
								{
									text : '保存',
									iconCls : 'acceptIcon',
									handler : function() {
										if (runMode == '0') {
											Ext.Msg
													.alert('提示',
															'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
											return;
										}
									
										var mode = Ext.getCmp('jjupmode')
												.getValue();
									
										if (mode == 'add')
											saveLxyJJItem();
										else
											updateLxyJJItem();
									}
								},  {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {										
										addLxyJJWindow.hide();
									}
								} ]
					});
			

			function addJJInit() {
				
				var flag = Ext.getCmp('jjupmode').getValue();
				if (typeof (flag) != 'undefined') {
					JJForm.getForm().getEl().dom.reset();
				} /*
					 * else { clearForm(JyForm.getForm()); }
					 */
				Ext.getCmp('jjryid').setValue(Ext.getCmp('ryid').getValue());
			// Ext.Msg.alert('提示',Ext.getCmp('Jyryid').getValue());
				addLxyJJWindow.show();				
				Ext.getCmp('jjupmode').setValue('add');
			}
			function saveLxyJJItem(){
		     if (!JJForm.form.isValid()) {
					return;
				}
				Ext.MessageBox.alert("add");
				JJForm.form.submit({
					url : 'lxy.do?reqCode=saveLxybmsqbJJItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						
						JJForm.getForm().getEl().dom.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
						JJstore.reload();
						// clearForm(GZForm.getForm());
						Ext.getCmp('jjupmode').setValue('add');
						Ext.getCmp('jjryid').setValue(Ext.getCmp('ryid').getValue());
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '人员数据保存失败:<br>' + msg);
					}
				});
				
				
			}
			function updateLxyJJItem(){
				
				if (!JJForm.form.isValid()) {
					return;
				}
				Ext.MessageBox.alert("update");
				JJForm.form.submit({
					url : 'lxy.do?reqCode=saveLxybmsqbJJItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						// addUserWindow.hide();
						// XUELIstore.load();
						var params = addUserForm.getForm().getValues();
						params.start = 0;
						params.limit = GZbbar.pageSize;						
						JJstore.load({
							params : params
						});	
						// GZForm.form().getEl().dom.reset();
						addLxyJJWindow.hide();
						
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '人员数据修改失败:<br>' + msg);
					}
				});
			}
			
			
			function JJupdate(){
				var record=JJgrid.getSelectionModel().getSelected();
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
				
				JJForm.getForm().loadRecord(record);
				// addUserForm.getForm().getEl().dom.reset();
				// usertypeCombo.setReadOnly(true);
				addLxyJJWindow.show();
				addLxyJJWindow.setTitle('<span class="commoncss">修改家庭成员信息</span>');
				// clearForm(addUserForm.getForm());
				Ext.getCmp('jjupmode').setValue('update');	
				
			}
			function deleteUserJJItem(){

				var rows = JJgrid.getSelectionModel().getSelections();
				var fields = '';
				/*
				 * for (var i = 0; i < rows.length; i++) { if
				 * (rows[i].get('usertype') == '3') { fields = fields +
				 * rows[i].get('username') + '<br>'; } }
				 */

				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'oid');
				Ext.Ajax.request({
					url : './lxy.do?reqCode=deleteLxybmsqbJJItem',
					success : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						JJstore.reload();
						Ext.Msg.alert('提示', resultArray.msg);
					},
					failure : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
					},
					params : {
						strChecked : strChecked
					}
				});
			
				
				
			}
			
			
		
			
			/**
			 * 布局
			 */
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ grid,queryUserFormPanel ]
			});

		});