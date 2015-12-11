package com.hr.xl.lxy.service.impl;

import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.orm.xibatis.sqlmap.client.SqlMapExecutor;
import org.g4studio.core.orm.xibatis.support.SqlMapClientCallback;
import org.g4studio.core.util.G4Constants;
import org.g4studio.core.util.G4Utils;

import com.hr.xl.lxy.service.LxyService;
import com.hr.xl.system.utils.IDHelper;

public class LxyServiceImpl extends BaseServiceImpl implements LxyService {

	private String excelmsg;
	private int isuccess;
	private int ierror;
	private int icount;

	public Dto saveLxybmsqbItem(Dto pDto) {
		Dto outDto = new BaseDto();
		Integer temp = (Integer) g4Dao.queryForObject("LXYBMSQB.checkIDCardUpdate", pDto);
		if (temp.intValue() != 0) {
			outDto.put("msg", "身份证[" + pDto.getAsString("sfzh") + "]已被存在,请检查!");
			outDto.put("success", new Boolean(false));
			return outDto;
		}
		System.out.println(IDHelper.getLxyID());
		String LxyID = IDHelper.getLxyID();

		pDto.put("ryid", Integer.valueOf(LxyID));
		pDto.put("rybh", LxyID);
		g4Dao.insert("LXYBMSQB.saveLxybmsqbItem", pDto);
		outDto.put("msg", "用户数据新增成功");
		outDto.put("success", new Boolean(true));
		outDto.put("ryid", LxyID);
		return outDto;
	}

	public Dto deleteLxybmsqbItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		String delename = "";
		String msg = "";
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("ryid", arrChecked[i]);
			dto.put("oid", arrChecked[i]);
			Dto deledto = (Dto) g4Dao.queryForObject("LXYBMSQB.queryLxydelete", dto);
			if (deledto.get("dqzt").equals("1")) {
				g4Dao.delete("LXYBMSQB.deleteLxybmsqbItem", dto);
				g4Dao.delete("LXYBMSQB.deleteLxybmsqbWbItem", dto);
				g4Dao.delete("LXYBMSQB.deleteLxybmsqbJyItem", dto);
				delename += "'" + deledto.get("xm") + "'";
			} else {
				msg += "'" + deledto.get("xm") + "'";
			}

			// g4Dao.delete("BMLXY.deleteBmlxyItem", dto);
		}
		if (!msg.isEmpty()) {
			msg = msg + "不允许删除，因为存在业务关系！";

		} else if (!delename.isEmpty()) {
			msg = delename + "已被删除！" + msg;
		}

		Dto outDto = new BaseDto();
		outDto.put("msg", msg);
		return outDto;
	}

	public Dto updateLxybmsqbItem(Dto pDto) {
		// TODO Auto-generated method stub
		Dto outDto = new BaseDto();
		Integer temp = (Integer) g4Dao.queryForObject("LXYBMSQB.checkIDCardUpdate", pDto);
		if (temp.intValue() != 0) {
			outDto.put("msg", "身份证[" + pDto.getAsString("sfzh") + "]已被存在,请检查!");
			outDto.put("success", new Boolean(false));
			return outDto;
		}
		g4Dao.update("LXYBMSQB.updateLxybmsqbItem", pDto);
		outDto.put("msg", "保存成功");
		outDto.put("success", new Boolean(true));
		return outDto;
	}

	public Dto saveLxybmsqbJyItem(Dto pDto) {
		Dto outDto = new BaseDto();

		if (G4Utils.isEmpty(pDto.getAsInteger("oid"))) {
			Integer oid = (Integer) g4Dao.queryForObject("LXYBMSQB.querylxyjyOID");

			if (oid == null) {
				oid = 0;
			}
			pDto.put("oid", oid + 1);
			g4Dao.insert("LXYBMSQB.saveLxybmsqbJyItem", pDto);
		} else {
			g4Dao.update("LXYBMSQB.updateLxybmsqbJyItem", pDto);
		}

		outDto.setSuccess(G4Constants.TRUE);
		return outDto;
	}

	public Dto saveLxybmsqbWbItem(Dto pDto) {
		Dto outDto = new BaseDto();
		if (G4Utils.isEmpty(pDto.getAsInteger("oid"))) {
			Integer oid = (Integer) g4Dao.queryForObject("LXYBMSQB.querylxyWBOID");
			if (oid == null) {
				oid = 0;
			}
			pDto.put("oid", oid + 1);
			g4Dao.insert("LXYBMSQB.saveLxybmsqbWbItem", pDto);
		} else {
			g4Dao.update("LXYBMSQB.updateLxybmsqbWbItem", pDto);
			System.out.println("lxywbitem update");
		}
		outDto.setSuccess(G4Constants.TRUE);
		return outDto;
	}

	public Dto deleteLxybmsqbJyItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("oid", arrChecked[i]);
			g4Dao.delete("LXYBMSQB.deleteLxybmsqbJyItem", dto);
		}
		return null;
	}

	public Dto deleteLxybmsqbWbItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("oid", arrChecked[i]);
			g4Dao.delete("LXYBMSQB.deleteLxybmsqbWbItem", dto);
		}
		return null;
	}

	public Dto updateLxyxj(Dto pDto) {
		List<Dto> lxyList = pDto.getDefaultAList();
		for(Dto dto : lxyList){
			dto.put("czy", pDto.getAsString("czy"));
			dto.put("czsj", pDto.getAsString("czsj"));
			dto.put("bdrq", pDto.getAsString("bdrq"));
			dto.put("hqxjrq", G4Utils.Date2String(pDto.getAsDate("hqxjrq"), "yyyyMMdd"));
			dto.put("xhqxjrq", G4Utils.Date2String(pDto.getAsDate("xhqxjrq"), "yyyyMMdd"));
			dto.put("xjjsrq", G4Utils.Date2String(pDto.getAsDate("xjjsrq"), "yyyyMMdd"));
			dto.put("bdzt", "0");
			dto.put("bdlx", "4");
			dto.put("xygxj", pDto.getAsString("xygxj"));
			
			String 	eventId = IDHelper.getHreventID();
			dto.put("hr_eventid", eventId);
			g4Dao.insert("LXYBDJL.saveLxybdjlBasicItem", dto);
			dto.put("ygxj", dto.getAsString("xygxj"));
			g4Dao.update("BMLXY.updateLxyxj", dto);
			if (dto.getAsString("ygxj").equalsIgnoreCase("0")){
				g4Dao.update("BMLXY.updateLxyxjEmpty", dto);
			}
		}
		return null;
	}

	public Dto saveLxybmsqbBatch(final Dto pDto) {
		excelmsg = "开始导入..............";
		isuccess = 0;
		ierror = 0;
		icount = 0;
		final String metaData = "xm,sfzh,pp,deptid,gw,ygxj,hyzk,mz,zzmm,hkxz,xzj,zgxl,byyx,xlzy,ydrq,jkzrq,lxsj,jjlxr,jjlxrsj";
		final Dto outdto = new BaseDto();
		g4Dao.getSqlMapClientTpl().execute(new SqlMapClientCallback() {
			public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {

				executor.startBatch();

				try {
					InputStream is = new FileInputStream(pDto.getAsString("filepath"));
					// ExcelReader excelReader = new ExcelReader(metaData, is);

					Workbook rwb = Workbook.getWorkbook(is);
					Sheet sheet = rwb.getSheet(0);
					int rows = sheet.getRows();
					int pagecolumn = 7;// 每次添加的数量
					if ((rows - 1 > pagecolumn)) {
						int pagemode = rows % pagecolumn;
						int page = rows / pagecolumn;
						for (int i = 0; i <= page; i++) {
							List list = null;
							if (i == 0) {
								list = read(1, (i + 1) * pagecolumn, is, metaData, rwb, pDto);
							} else if (i == page) {
								list = read(i * pagecolumn, i * pagecolumn + pagemode, is, metaData, rwb, pDto);
							} else {
								list = read(i * pagecolumn, (i + 1) * pagecolumn, is, metaData, rwb, pDto);
							}
							batchsave(list);
						}

					} else if (rows != 1) {
						List list = read(1, rows, is, metaData, rwb, pDto);
						batchsave(list);
					}

					icount = isuccess + ierror;
					excelmsg = excelmsg + "\r\n" + "导入结束，导入成功：" + String.valueOf(isuccess) + "人 ；导入失败：" + String.valueOf(ierror) + "人，一共" + String.valueOf(icount) + "人。";
					
					outdto.put("msg", excelmsg);
					outdto.put("success", new Boolean(true));

				} catch (Exception e) {
					outdto.put("msg", "导入失败");
					outdto.put("success", new Boolean(false));
					e.printStackTrace();
				}

				executor.executeBatch();
				return outdto;

			}
		});

		return outdto;
	}

	public List read(int pBegin, int pBack, InputStream is, String metaD, Workbook rwb, Dto pdto) throws BiffException, Exception {
		List list = new ArrayList();
		// Workbook workbook = Workbook.getWorkbook(is);
		Sheet sheet = rwb.getSheet(0);
		int rows = sheet.getRows();
		for (int i = pBegin; i < pBack; i++) {
			Dto rowDto = new BaseDto();
			Cell[] cells = sheet.getRow(i);
			if (cells.length > 0) {
				if (!G4Utils.isEmpty(cells[0].getContents())) {
					rowDto.put("jdr", pdto.getAsString("jdr"));
					rowDto.put("jdrq", pdto.getAsString("jdrq"));
					String[] arrMeta = metaD.trim().split(",");
					for (int j = 0; j < arrMeta.length; j++) {
						String key = arrMeta[j];
						if (G4Utils.isNotEmpty(key))
							rowDto.put(key, cells[j].getContents());
					}
					if (G4Utils.isNotEmpty(rowDto.getAsString("sfzh"))) {
						list.add(rowDto);
					}
				}
			}
		}
		return list;
	}

	// 验证身份证号和部门编码
	private Dto checkIDcard(Dto dto) throws Exception {
		String xm = dto.getAsString("xm");
		Dto outDto = new BaseDto();
		try{
			String ydrq = G4Utils.Date2String(dto.getAsDate("ydrq"), "yyyyMMdd");
			String jkzrq = G4Utils.Date2String(dto.getAsDate("jkzrq"), "yyyyMMdd");
			dto.put("ydrq", ydrq);
			dto.put("jkzrq", jkzrq);
		}catch(Exception e){
			e.printStackTrace();
			throw new Exception(xm + "导入失败：入企日期或是健康证日期错误!");
		}

		/**
		 * 身份证号校验：号码校验+重复校验
		 */
		String sfzh = dto.getAsString("sfzh");
		if (!G4Utils.isIdentity(sfzh)){
			throw new Exception(xm + "导入失败：身份证号[" + sfzh + "]非法！");
		}
		Integer IDCount = (Integer) g4Dao.queryForObject("LXYBMSQB.checkIDCardUpdate", dto);
		if (IDCount > 0) {
			throw new Exception(xm + "导入失败：身份证号[" + sfzh + "]重复！");
		}
		
		/**
		 * 部门编码校验
		 */
		Integer deptCount = (Integer) g4Dao.queryForObject("LXYBMSQB.deptCount", dto);
		if (deptCount.intValue() == 0){
			throw new Exception(xm + "导入失败：指定的部门编码" + dto.getAsString("deptid") + "不存在！");
		}
		
		dto.put("csrq", G4Utils.Date2String(G4Utils.getBirthdayFromPersonIDCode(sfzh), "yyyyMMdd"));
		dto.put("xb", G4Utils.getGenderFromPersonIDCode(sfzh));		
	
		return dto;
	}

	public void batchsave(List list) throws Exception {
	
		for (int i = 0; i < list.size(); i++) {
			Dto dto = new BaseDto();
			dto = (Dto) list.get(i);

			dto.put("dqzt", 2);
			// Date d = sdf.parse(dto.getAsString("ydrq"));
			/*
			 * dto.put("ydrq", G4Utils.stringToDate(dto.getAsString("ydrq"),
			 * "Y-m-d", "yyyy-MM-dd")); System.out.println("ydrq:" +
			 * dto.getAsString("ydrq"));
			 */
			/*
			 * String ydrq2 = G4Utils.Date2String(G4Utils.stringToDate(
			 * dto.getAsString("ydrq"), "yyyy/MM/dd", "yyyyMMdd"), "yyyyMMdd");
			 */
			/*
			 * dto.put("ydrq", G4Utils.Date2String(G4Utils.stringToDate(
			 * dto.getAsString("ydrq"), "yyyy/MM/dd", "yyyyMMdd"), "yyyyMMdd"));
			 * System.out.println("ydrq:" + dto.getAsString("ydrq"));
			 * 
			 * String jkzrq = G4Utils.Date2String(G4Utils.stringToDate(
			 * dto.getAsString("jkzrq"), "yyyy/MM/dd", "yyyyMMdd"), "yyyyMMdd");
			 * System.out.println("jkzrq:" + jkzrq); dto.put("jkzrq", jkzrq);
			 * System.out.println("jkzrq:" + dto.getAsString("jkzrq"));
			 */
			Dto outdto = new BaseDto();
			try{
				outdto = checkIDcard(dto);
				String LxyID = IDHelper.getLxyID();
				dto.put("rybh", LxyID);
				dto.put("ryid", Integer.valueOf(LxyID));
				dto.put("csrq", outdto.getAsString("csrq"));
				dto.put("xb", outdto.getAsString("xb"));
				g4Dao.insert("LXYBMSQB.saveLxybmsqbItem", dto);
				g4Dao.insert("BMLXY.saveLxybmItem", dto);
				excelmsg = excelmsg + dto.getAsString("xm") + "导入成功！";
				isuccess++;
			}catch(Exception e) {
				excelmsg = excelmsg + "\r\n" + outdto.getAsString("xm") + outdto.getAsString("sfzh") + e.getMessage();
				ierror++;
				continue;
			}
		}
	}

	@Override
	public Dto saveLxybmsqbJJItem(Dto pDto) {
		if (G4Utils.isEmpty(pDto.getAsInteger("oid"))) {
			g4Dao.insert("LXYBMSQB.saveLxybmsqbJJItem", pDto);
		} else {
			g4Dao.update("LXYBMSQB.updateLxybmsqbJJItem", pDto);
		}
		Dto outDto = new BaseDto();
		outDto.setSuccess(G4Constants.TRUE);
		return outDto;
	}

	@Override
	public Dto deleteLxybmsqbJJItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("oid", arrChecked[i]);
			g4Dao.delete("LXYBMSQB.deleteLxybmsqbJJItem", dto);
		}
		return null;
	}

	/**
	 * Excel批量导入，替代原先的方法
	 * @author xuyan
	 */
	public Dto importFromExcel(Dto pDto) {
		Dto outDto = new BaseDto();
		List<Dto> aList = pDto.getDefaultAList();
		
		String jdr = pDto.getAsString("jdr");
		Long jdrq = pDto.getAsLong("jdrq");
		for(Dto dto : aList){
			String lxyId = IDHelper.getLxyID();
			dto.put("jdr", jdr);
			dto.put("jdrq", jdrq);
			dto.put("rybh", lxyId);
			dto.put("ryid", Integer.valueOf(lxyId));
			g4Dao.insert("LXYBMSQB.saveLxybmsqbItem", dto);
		}
		return null;
	}

}
