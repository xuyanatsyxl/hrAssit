package org.infotechdept.hr.kq.web;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.g4studio.common.web.BaseAction;
import org.g4studio.common.web.BaseActionForm;
import org.g4studio.core.json.JsonHelper;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.mvc.xstruts.action.ActionForm;
import org.g4studio.core.mvc.xstruts.action.ActionForward;
import org.g4studio.core.mvc.xstruts.action.ActionMapping;
import org.g4studio.core.util.G4Utils;
import org.g4studio.core.web.report.excel.ExcelExporter;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;
import org.infotechdept.hr.kq.service.AdcShiftExceptionService;

import com.hr.xl.system.utils.HRUtils;

public class AdcShiftExceptionAction extends BaseAction {

	private OrganizationService organizationService = (OrganizationService) super
			.getService("organizationService");
	private AdcShiftExceptionService adcShiftExceptionService = (AdcShiftExceptionService) super
			.getService("adcShiftExceptionService");

	/**
	 * 查询初始化
	 */
	public ActionForward adcShiftExceptionInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo()
				.getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("manageAdcShiftExceptionView");
	}

	/**
	 * 查询
	 */
	public ActionForward queryAdcShiftExceptionItemForManage(
			ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isEmpty(deptid)) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo()
					.getDeptid());
		}
		dto.put("cascadeid", organizationService.queryCascadeidByDeptid(dto.getAsInteger("deptid")));
		dto.remove("deptid");
		super.setSessionAttribute(request, "QUERYADCSHIFTEXCEPTION_QUERYDTO",
				dto);

		List items = g4Reader.queryForPage(
				"AdcShiftException.queryAdcShiftExceptionItemForManage", dto);
		for (int i = 0; i < items.size(); i++) {
			Dto dto2 = (BaseDto) items.get(i);
			dto2.put("exception_date", G4Utils.Date2String(
					dto2.getAsDate("exception_date"), "yyyy-MM-dd"));
			dto2.put("check_time", G4Utils.Date2String(
					dto2.getAsTimestamp("check_time"), "HH:mm:ss"));
			dto2.put("actual_check_time", G4Utils.Date2String(
					dto2.getAsTimestamp("actual_check_time"), "HH:mm:ss"));
			dto2.put("operate_time", G4Utils.Date2String(
					dto2.getAsTimestamp("operate_time"), "yyyy-MM-dd HH:mm:ss"));
		}
		Integer pageCount = (Integer) g4Reader
				.queryForObject(
						"AdcShiftException.queryAdcShiftExceptionItemForManageForPageCount",
						dto);
		String jsonString = JsonHelper.encodeList2PageJson(items, pageCount,
				null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	/**
	 * 更新
	 */
	public ActionForward updateAdcShiftExceptionItem(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("operator", super.getSessionContainer(request).getUserInfo()
				.getUserid());
		inDto.put("operate_time", G4Utils.getCurrentTimestamp());
		adcShiftExceptionService.updateAdcShiftExceptionItem(inDto);
		setOkTipMsg("异常处理成功！", response);
		return mapping.findForward(null);
	}

	/**
	 * 导出EXCEL
	 */
	public ActionForward queryAdcShiftExceptionForExcel(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "异常明细统计表");
		parametersDto.put("jbr", super.getSessionContainer(request)
				.getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		Dto inDto = (BaseDto) super.getSessionAttribute(request, "QUERYADCSHIFTEXCEPTION_QUERYDTO");
		List fieldsList = g4Reader.queryForList("AdcShiftException.queryAdcShiftExceptionItemForManage",
				inDto);
		for (int i = 0; i < fieldsList.size(); i++) {
			Dto dto2 = (BaseDto) fieldsList.get(i);
			dto2.put("exception_date", G4Utils.Date2String(
					dto2.getAsDate("exception_date"), "yyyy-MM-dd"));
			if (dto2.getAsString("proc_state").equalsIgnoreCase("2")){
				dto2.put("proc_state", "异常");
			}else{
				dto2.put("proc_state", "已处理");
			}
			if (dto2.getAsString("exception_field").equalsIgnoreCase("work_time")){
				dto2.put("exception_field", "上班");
			}else{
				dto2.put("exception_field", "下班");
			}
			dto2.put("check_time", G4Utils.Date2String(
					dto2.getAsTimestamp("check_time"), "HH:mm:ss"));
			dto2.put("actual_check_time", G4Utils.Date2String(
					dto2.getAsTimestamp("actual_check_time"), "HH:mm:ss"));
			dto2.put("operate_time", G4Utils.Date2String(
					dto2.getAsTimestamp("operate_time"), "yyyy-MM-dd HH:mm:ss"));
		}
		List subList = fieldsList.subList(0, fieldsList.size());
		parametersDto.put("countXmid", new Integer(subList.size()));// 合计条数
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/adc/adcShiftExceptionOut.xls");
		excelExporter.setData(parametersDto, subList);
		excelExporter.setFilename("异常明细统计表.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}
}
