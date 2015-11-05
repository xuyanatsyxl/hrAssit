package com.hr.xl.kq.web;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
import org.g4studio.core.util.G4Constants;
import org.g4studio.core.util.G4Utils;
import org.g4studio.core.web.report.excel.ExcelExporter;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;

import com.hanvon.faceid.sdk.FaceId;
import com.hanvon.faceid.sdk.FaceIdAnswer;
import com.hanvon.faceid.sdk.FaceId_ErrorCode;
import com.hr.xl.kq.device.HanvonDeviceClient;
import com.hr.xl.kq.service.DkjService;
import com.hr.xl.kq.service.DkjlService;

public class DkjAction extends BaseAction {

	private DkjService dkjService = (DkjService) super.getService("dkjService");
	private DkjlService dkjlService = (DkjlService) super.getService("dkjlService");
	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");

	public ActionForward dkjInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("manageDkjView");
	}

	public ActionForward queryDkjlbForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		}
		if (!G4Utils.isEmpty(request.getParameter("firstload"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		} else {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}

		List dkjList = g4Reader.queryForPage("DKJLB.queryDkjlbForManage", dto);
		Integer pageCount = (Integer) g4Reader.queryForObject("DKJLB.queryDkjlbForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(dkjList, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward saveDkjlbItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = dkjService.saveDkjlbItem(inDto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward deleteDkjlbItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			dkjService.deleteDkjlbItem(inDto);
			setOkTipMsg("用户数据删除成功", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward updateDkjlbItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		if (!isDemoMode(response)) {
			dkjService.updateDkjlbItem(inDto);
			setOkTipMsg("打卡机数据修改成功", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward saveAllRecord(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List<Dto> macList = aForm.getGridDirtyData(request);
		Date rq = inDto.getAsDate("colDate");
		String deviceCharSet = "GBK";
		String command = "GetRecord(start_time=\"" + new SimpleDateFormat("yyyy-MM-dd H:m:s").format(rq) + "\")";

		for (Dto d : macList) {

			FaceId tcpClient = new FaceId(d.getAsString("ip"), Integer.parseInt("9922"));

			FaceIdAnswer output = new FaceIdAnswer();
			FaceId_ErrorCode errorCode = tcpClient.Execute(command, output, deviceCharSet);

			if (errorCode.equals(FaceId_ErrorCode.Success)) {
				Pattern p = Pattern.compile("\\b(time=.+)\\r");
				Matcher m = p.matcher(output.answer);
				while (m.find()) {
					StringBuffer sb = new StringBuffer(m.group(1));
					String st = sb.substring(6, 25);
					d.put("empid", sb.substring(31, sb.indexOf("name") - 2));
					d.put("dksj", st);
					d.put("bz", m.group(1));
					dkjlService.saveDkjlItem(d);
				}
			}
		}
		return mapping.findForward(null);
	}

	public ActionForward queryDkjlInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("queryDkjlView");
	}

	public ActionForward queryDkjlForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		}
		if (!G4Utils.isEmpty(request.getParameter("firstload"))) {
			inDto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		} else {
			inDto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}
		inDto.put("kssj", G4Utils.Date2String(inDto.getAsTimestamp("kssj"), "yyyyMMddHHmmss"));
		inDto.put("jssj", G4Utils.Date2String(inDto.getAsTimestamp("jssj"), "yyyyMMddHHmmss"));
		
		super.setSessionAttribute(request, "QUERYDKJL_QUERYDTO", inDto);
		
		List emplList = g4Reader.queryForPage("DKJL.queryDkjlForManage", inDto);
		for (int i = 0; i < emplList.size(); i++) {
			Dto dto2 = (BaseDto) emplList.get(i);
			dto2.put("dksj", G4Utils.stringToDate(dto2.getAsString("dksj"), "yyyyMMddHHmmss", "yyyy-MM-dd HH:mm:ss"));
		}
		log.info(inDto.toString());
		Integer pageCount = (Integer) g4Reader.queryForObject("DKJL.queryDkjlForManageForPageCount", inDto);
		String jsonString = JsonHelper.encodeList2PageJson(emplList, pageCount, G4Constants.FORMAT_DateTime);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 打卡记录EXCEL导出
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryDkjlForExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "打卡流水明细");
		parametersDto.put("jbr", super.getSessionContainer(request)
				.getUserInfo().getUsername());
		parametersDto.put("jbsj", G4Utils.getCurrentTime());
		Dto inDto = (BaseDto) super.getSessionAttribute(request, "QUERYDKJL_QUERYDTO");
		List fieldsList = g4Reader.queryForList("DKJL.queryDkjlForManage",	inDto);
		List subList = fieldsList.subList(0, fieldsList.size());
		parametersDto.put("countXmid", new Integer(subList.size()));// 合计条数
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/hr/adc/dkjl.xls");
		excelExporter.setData(parametersDto, subList);
		excelExporter.setFilename("打卡流水.xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	public ActionForward setSrvIp(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		String srvIp = inDto.getAsString("srvip");

		String msg = "下列服务器设置失败[";
		boolean suc = true;

		String[] arrChecked = inDto.getAsString("clientip").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			HanvonDeviceClient hdc = new HanvonDeviceClient(arrChecked[i], String.valueOf("9922"));
			if (!hdc.setServerIp(srvIp).getAsBoolean("success")) {
				suc = false;
				msg += arrChecked[i] + ",";
			}
			hdc.Close();
		}
		if (suc) {
			setOkTipMsg("全部考勤机自动上传服务器设置成功！", response);
		} else {
			setErrTipMsg(msg, response);
		}

		return mapping.findForward(null);
	}

	public ActionForward downloadEmpls(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		String ip = inDto.getAsString("ip");
		HanvonDeviceClient hdc = new HanvonDeviceClient(ip, String.valueOf("9922"));
		int iErr = 0;
		int iSuc = 0;
		List<Dto> cardList = g4Reader.queryForList("EMPLOYEE.queryForDownload");
		for (Dto pDto : cardList) {
			if (hdc.setEmployee(pDto.getAsInteger("empid"), pDto.getAsString("name"), pDto.getAsString("card"))) {
				iSuc++;
			} else {
				iErr++;
			}
		}

		setOkTipMsg(String.format("数据下发完毕，共有[%d]条下发成功，[%d]条下发失败！", iSuc, iErr), response);
		hdc.Close();
		return mapping.findForward(null);
	}
}
