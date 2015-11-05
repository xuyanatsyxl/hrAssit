/**
 * 欢迎页面
 * 
 */
Ext.onReady(function() {
			new Ext.ux.TipWindow({
						title : '<span class=commoncss>提示</span>',
						html : '您有[0]条未读信息. ',
						iconCls : 'commentsIcon'
					}).show(Ext.getBody());
		});

Ext.onReady(function() {
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

	var tools = [{
				id : 'maximize',
				handler : function(e, target, panel) {
				}
			}];

	var my_height1 = document.body.clientHeight - 35;
	var my_height = document.body.clientHeight - 65;
	
	/**
	 * 徐岩加，下载模板用
	 */
	var my_doc = '<div style="margin:10px">';
	var store_file = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : 'demo/otherDemo.do?reqCode=queryFileDatas'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [{
									name : 'fileid'
								}, {
									name : 'title'
								}, {
									name : 'path'
								}, {
									name : 'filesize'
								}, {
									name : 'remark'
								}])
			});	

	store_file.load({
		params : {
			start : 0,
			limit : 20
		},
		callback : function(r){
			Ext.each(r, function(item){
				my_doc += '<a href="./demo/otherDemo.do?reqCode=downloadFile&fileid=' + item.get('fileid') + '">' + item.get('title') + '</a><br>';				
			})
			my_doc += '</div>';				
		}
	});	
	
	function getUrl(){
		var my_doc = '<div style="margin:10px">';
		var store_file = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : 'demo/otherDemo.do?reqCode=queryFileDatas'
							}),
					reader : new Ext.data.JsonReader({
								totalProperty : 'TOTALCOUNT',
								root : 'ROOT'
							}, [{
										name : 'fileid'
									}, {
										name : 'title'
									}, {
										name : 'path'
									}, {
										name : 'filesize'
									}, {
										name : 'remark'
									}])
				});	

		store_file.load({
			params : {
				start : 0,
				limit : 20
			},
			callback : function(r){
				Ext.each(r, function(item){
					my_doc += '<a href="./demo/otherDemo.do?reqCode=downloadFile&fileid=' + item.get('fileid') + '">' + item.get('title') + '</a><br>';				
				})
				my_doc += '</div>';				
			}
		});			
	}
	
	//var my_doc = '<div style="margin:10px"><a href="../moban/lxy_moban.xls">联销员批量导入模板下载</a><br><a href="../hr/moban/lxy_moban.xls">加班申请表模板下载</a></div>';
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			xtype : 'portal',
			region : 'center',
			margins : '3 3 3 3',
			items : [{
						columnWidth : .7,
						style : 'padding:8px 0px 8px 8px',
						items : [{
									title : '系统通知',
									layout : 'fit',
									height : 550,
									html:'[2015-01-21]<br>为和OA系统实现互通，考勤信息维护选项发生变化，请注意！'
								}]
					}, {
						columnWidth : .3,
						style : 'padding:8px 8px 8px 8px',
						items : [{
							title : '文档及模板下载 ',
							html : my_doc
						}, {
							title : '联系方式',
							// tools : tools,
							html : '<div style=height:60px;line-height:25px class=commoncss>&nbsp;&nbsp;咨询邮箱: xuyan76@xinglonggroup.com<br>&nbsp;&nbsp;报修RTX：7979</div>'
						}]
					}]
		}]
	});
});
