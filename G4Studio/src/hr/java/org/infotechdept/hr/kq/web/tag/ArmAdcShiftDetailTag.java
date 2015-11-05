package org.infotechdept.hr.kq.web.tag;

import java.io.IOException;
import java.io.StringWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.tplengine.DefaultTemplate;
import org.g4studio.core.tplengine.FileTemplate;
import org.g4studio.core.tplengine.TemplateEngine;
import org.g4studio.core.tplengine.TemplateEngineFactory;
import org.g4studio.core.tplengine.TemplateType;
import org.g4studio.core.util.G4Constants;
import org.g4studio.core.web.taglib.util.TagHelper;

/**
 * ArmAdcShiftDetailTag标签:G4Studio_ARM专用
 * 
 * @author xuyan
 * @since 2015-02-10
 */
public class ArmAdcShiftDetailTag extends TagSupport {
	private static Log log = LogFactory.getLog(ArmAdcShiftDetailTag.class);

	/**
	 * 标签开始
	 */
	public int doStartTag() throws JspException {
		HttpServletRequest request = (HttpServletRequest) this.pageContext.getRequest();
		String shift_id = request.getParameter("shift_id");

		Dto dto = new BaseDto();
		dto.put("shift_id", shift_id);
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
	 * 标签结束
	 */
	public int doEndTag() throws JspException {
		return super.EVAL_PAGE;
	}

	/**
	 * 释放资源
	 */
	public void release() {
		super.release();
	}
}
