package org.g4studio.core.web.report.jasper;

import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jasperreports.engine.DefaultJasperReportsContext;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JRRuntimeException;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRXlsAbstractExporter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.JRXlsExporterContext;
import net.sf.jasperreports.engine.util.JRLoader;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleXlsReportConfiguration;
import net.sf.jasperreports.export.XlsExporterConfiguration;
import net.sf.jasperreports.export.XlsReportConfiguration;

import org.g4studio.common.web.BaseAction;
import org.g4studio.core.exception.G4Exception;
import org.g4studio.core.mvc.xstruts.action.ActionForm;
import org.g4studio.core.mvc.xstruts.action.ActionForward;
import org.g4studio.core.mvc.xstruts.action.ActionMapping;
import org.g4studio.core.util.G4Utils;

/**
 * JasperReport报表服务Acion
 * 
 * @author XiongChun
 * @since 2009-09-03
 */
public class ReportAcion extends BaseAction {

	/**
	 * 打印模板页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward initAppletPage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String flag = request.getParameter("flag");
		String url = request.getContextPath() + "/report.do?reqCode=appletPreview&jsessionid=" + request.getSession().getId();
		if (!G4Utils.isEmpty(flag)) {
			url = url + "&reportflag=" + flag;
		}
		request.setAttribute("dataUrl", url);
		return mapping.findForward("printInitView");
	}
	
	/**
	 * PDF模板页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward initPdfPage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String flag = request.getParameter("flag");
		String url = request.getContextPath() + "/report.do?reqCode=pdfPreview&jsessionid=" + request.getSession().getId();
		if (!G4Utils.isEmpty(flag)) {
			url = url + "&reportflag=" + flag;
		}
		request.setAttribute("dataUrl", url);
		return mapping.findForward("pdfInitView");
	}

	/**
	 * HTML模板页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward initHtmlPage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String flag = request.getParameter("flag");
		String url = request.getContextPath() + "/report.do?reqCode=htmlPreview&jsessionid=" + request.getSession().getId();
		if (!G4Utils.isEmpty(flag)) {
			url = url + "&reportflag=" + flag;
		}
		request.setAttribute("dataUrl", url);
		return mapping.findForward("htmlInitView");
	}
	
	/**
	 * HTML模板页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward initXlsPage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String flag = request.getParameter("flag");
		String url = request.getContextPath() + "/report.do?reqCode=xlsPreview&jsessionid=" + request.getSession().getId();
		if (!G4Utils.isEmpty(flag)) {
			url = url + "&reportflag=" + flag;
		}
		request.setAttribute("dataUrl", url);
		return mapping.findForward("xlsInitView");
	}
	
	/**
	 * 实例化报表对象,填充报表数据 显示方式:applet
	 * 
	 * @param
	 * @return
	 */
	public ActionForward appletPreview(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// 接收url传过来的报表标识参数
		String flag = request.getParameter("reportflag");
		flag = G4Utils.isEmpty(flag) ? "default" : flag;
		JasperPrint jasperPrint = getJasperPrintObjectFromSession(flag, request);
		if (G4Utils.isEmpty(jasperPrint)) {
			throw new JRRuntimeException("实例化打印对象失败,请检查填充数据域和模板文件");
		}
		response.setContentType("application/octet-stream");
		ServletOutputStream ouputStream = response.getOutputStream();
		ObjectOutputStream oos = new ObjectOutputStream(ouputStream);
		oos.writeObject(jasperPrint);
		oos.flush();
		oos.close();
		ouputStream.flush();
		ouputStream.close();
		return mapping.findForward(null);
	}

	/**
	 * 实例化报表对象,填充报表数据 显示方式:pdf
	 * 
	 * @param
	 * @return
	 */
	public ActionForward pdfPreview(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// 接收url传过来的报表标识参数
		String flag = request.getParameter("reportflag");
		flag = G4Utils.isEmpty(flag) ? "default" : flag;
		JasperPrint jasperPrint = getJasperPrintObjectFromSession(flag, request);
		if (G4Utils.isEmpty(jasperPrint)) {
			throw new JRRuntimeException("实例化打印对象失败,请检查填充数据域和模板文件");
		}
		OutputStream os = response.getOutputStream();
		response.setContentType("application/pdf");
		//TODO 支持下载报表文件时的文件名参数
		response.setHeader("Content-Disposition", "inline;filename="+ URLEncoder.encode("自定义文件名.pdf", "utf-8")); 
		JRPdfExporter exporter = new JRPdfExporter(DefaultJasperReportsContext.getInstance());
		exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
		exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(os));
		exporter.exportReport();
		return mapping.findForward(null);
	}
	
	/**
	 * 实例化报表对象,填充报表数据 显示方式:html
	 * 徐岩加 jasperReport 6.1 功能
	 * @param
	 * @return
	 */
	public ActionForward htmlPreview(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// 接收url传过来的报表标识参数
		String flag = request.getParameter("reportflag");
		flag = G4Utils.isEmpty(flag) ? "default" : flag;
		JasperPrint jasperPrint = getJasperPrintObjectFromSession(flag, request);
		if (G4Utils.isEmpty(jasperPrint)) {
			throw new JRRuntimeException("实例化打印对象失败,请检查填充数据域和模板文件");
		}
		
		PrintWriter out = response.getWriter();
		HtmlExporter exporter = new HtmlExporter();
		exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
		SimpleHtmlExporterOutput output = new SimpleHtmlExporterOutput(out);
		exporter.setExporterOutput(output);
		exporter.exportReport();
		return mapping.findForward(null);
	}	

	/**
	 * EXCEL报表输出
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward xlsPreview(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)  throws Exception{
		String flag = request.getParameter("reportflag");
		flag = G4Utils.isEmpty(flag) ? "default" : flag;
		JasperPrint jasperPrint = getJasperPrintObjectFromSession(flag, request);
		response.setHeader("Content-Disposition", "inline;filename=" + URLEncoder.encode("自定义文件名.xls", "utf-8"));
		if (G4Utils.isEmpty(jasperPrint)) {
			throw new JRRuntimeException("实例化打印对象失败,请检查填充数据域和模板文件");
		}
		JRXlsAbstractExporter<XlsReportConfiguration, XlsExporterConfiguration, JRXlsExporterContext> exporter = new JRXlsExporter(
				DefaultJasperReportsContext.getInstance());
		exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
		SimpleXlsReportConfiguration configuration = new SimpleXlsReportConfiguration();
		configuration.setOnePagePerSheet(false);
		configuration.setWhitePageBackground(false);
		exporter.setConfiguration(configuration);
		OutputStream outputStream = response.getOutputStream();
		exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		try {
			exporter.exportReport();
			outputStream.flush();
		} catch (Exception e) {
			throw new G4Exception(e.getMessage());
		} finally {
			if (outputStream != null) {
				try {
					outputStream.close();
				} catch (IOException ex) {
				}
			}
		}
		return mapping.findForward(null);		
	}
	
	/**
	 * 获取JasperPrint对象
	 * 
	 * @param pFlag
	 * @return
	 */
	private JasperPrint getJasperPrintObjectFromSession(String pFlag, HttpServletRequest request) throws Exception {
		ReportData reportData = super.getSessionContainer(request).getReportData(pFlag);
		if (G4Utils.isEmpty(reportData)) {
			throw new JRRuntimeException("没有获取到报表数据对象[ReportData],请检查!");
		}
        InputStream is = getServlet().getServletContext().getResourceAsStream(reportData.getReportFilePath()); 
		if (is == null) {
			throw new JRRuntimeException("模板文件未找到,请确认模板文件路径是否正确" + "[" + reportData.getReportFilePath() + "]");
		}
		JasperPrint jasperPrint = null;
		JasperReport jasperReport = (JasperReport) JRLoader.loadObject(is);
		List fieldsList = reportData.getFieldsList();
		if (G4Utils.isEmpty(fieldsList)) {
			jasperPrint = JasperFillManager.fillReport(jasperReport, reportData.getParametersDto(),
					new JREmptyDataSource());
		} else {
			JRBeanCollectionDataSource jRDataSource = new JRBeanCollectionDataSource(fieldsList);
			jasperPrint = JasperFillManager.fillReport(jasperReport, reportData.getParametersDto(), jRDataSource);
		}
		return jasperPrint;
	}
}
