package org.infotechdept.hr.kq.web.tag;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.g4studio.common.dao.Dao;
import org.g4studio.common.util.SpringBeanLoader;
import org.g4studio.common.util.WebUtils;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.tplengine.DefaultTemplate;
import org.g4studio.core.tplengine.FileTemplate;
import org.g4studio.core.tplengine.TemplateEngine;
import org.g4studio.core.tplengine.TemplateEngineFactory;
import org.g4studio.core.tplengine.TemplateType;
import org.g4studio.core.util.G4Constants;
import org.g4studio.core.web.taglib.util.TagHelper;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.admin.web.tag.vo.DeptVo;
import org.g4studio.system.admin.web.tag.vo.UserVo;
import org.infotechdept.hr.kq.web.tag.vo.DkjVo;

/**
 * ArmSelectDkjTreeTag标签:
 * @author xuyan
 * @since 2015-07-14
 */
public class ArmSelectDkjTreeTag extends TagSupport {
	
	private static Log log = LogFactory.getLog(ArmSelectDkjTreeTag.class);
	
	/**
	 * 标签开始
	 */
	public int doStartTag() throws JspException{
		Dao g4Dao = (Dao)SpringBeanLoader.getSpringBean("g4Dao");
		OrganizationService organizationService = (OrganizationService)SpringBeanLoader.getSpringBean("organizationService");
		HttpServletRequest request = (HttpServletRequest)this.pageContext.getRequest();
		String deptid = request.getParameter("deptid");
		String cascadeid = organizationService.queryCascadeidByDeptid(Integer.valueOf(deptid));
		Dto deptDto = new BaseDto();
		deptDto.put("deptid", deptid);
		deptDto.put("cascadeid", cascadeid);
		List deptList = g4Dao.queryForList("ArmTagSupport.queryDeptsForRoleGrant", deptDto);
		List dkjList = new ArrayList();
		
		Dto dkjDto = new BaseDto();
		for(int i = 0; i < deptList.size(); i++){
			DeptVo deptVo = (DeptVo)deptList.get(i);
			if(deptVo.getDeptid().equals(deptid)){
				deptVo.setIsroot("true");
			}
			dkjDto.put("deptid", deptVo.getDeptid());
			List tempList = g4Dao.queryForList("AdcDinnerRoom.queryDkjsForRoleGrant", dkjDto);
			dkjList.addAll(tempList);
		}
		Dto grantDto = new BaseDto();
		grantDto.put("room_id", request.getParameter("room_id"));
		List grantList = g4Dao.queryForList("AdcDinnerRoom.queryGrantedUsersByRoleId", grantDto);
		for(int i = 0; i < dkjList.size(); i++){
			DkjVo dkjVo = (DkjVo)dkjList.get(i);
			if(checkGrant(grantList, dkjVo.getDkjid())){
				dkjVo.setChecked("true");
			}
		}
        Dto dto = new BaseDto();
        dto.put("deptList", deptList);
        dto.put("dkjList", dkjList);
        dto.put("room_id", request.getParameter("room_id"));
        dto.put("deptid", deptid);
		TemplateEngine engine = TemplateEngineFactory.getTemplateEngine(TemplateType.VELOCITY);
		DefaultTemplate template = new FileTemplate();
		template.setTemplateResource(TagHelper.getTemplatePath(getClass().getName()));
		StringWriter writer = engine.mergeTemplate(template, dto);
		try {
			pageContext.getOut().write(writer.toString());
		} catch (IOException e) {
			log.error(G4Constants.Exception_Head + e.getMessage());
			e.printStackTrace();
		}
		return super.SKIP_BODY;
	}
	
	/**
	 * 检查授权
	 * @param grantList
	 * @param pUserid
	 * @return
	 */
	private boolean checkGrant(List grantList, String pDkjid){
		Boolean result = new Boolean(false);
		for(int i = 0; i < grantList.size(); i++){
			Dto dto = (BaseDto)grantList.get(i);
			if(pDkjid.equals(dto.getAsString("dkjid"))){
				result = new Boolean(true);
			}
		}
		return result.booleanValue();
	}
	
	/**
	 * 标签结束
	 */
	public int doEndTag() throws JspException{
		return super.EVAL_PAGE;
	}
	
	/**
	 * 释放资源
	 */
	public void release(){
		super.release();
	}
}
