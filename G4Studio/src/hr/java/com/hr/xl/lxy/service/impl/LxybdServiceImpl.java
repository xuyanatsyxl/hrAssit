package com.hr.xl.lxy.service.impl;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;

import com.hr.xl.lxy.service.LxybdService;
import com.hr.xl.system.utils.IDHelper;

public class LxybdServiceImpl extends BaseServiceImpl implements LxybdService {

	/**
	 * 上岗
	 */
	public Dto saveLxysgItem(Dto pDto) {
		Dto dto = new BaseDto();
		Calendar c = Calendar.getInstance();
		SimpleDateFormat f = new SimpleDateFormat("yyyyMMdd");

		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		dto.put("deptid", pDto.getAsString("deptid"));
		dto.put("czy", pDto.getAsString("czy"));
		dto.put("ghdw", pDto.getAsString("ghdw"));
		dto.put("pp", pDto.getAsString("pp"));
		dto.put("ydrq",
				G4Utils.Date2String(pDto.getAsTimestamp("sgrq"), "yyyyMMdd"));
		dto.put("yxq",
				G4Utils.Date2String(pDto.getAsTimestamp("yxq"), "yyyyMMdd"));
		dto.put("bdrq",
				G4Utils.Date2String(pDto.getAsTimestamp("sgrq"), "yyyyMMdd"));
		dto.put("bdlx", "1");
		dto.put("czsj", G4Utils.Date2String(G4Utils.getCurrentTimestamp(),
				"yyyyMMddHHmmss"));
		dto.put("bdzt", "0");
		dto.put("ygxj", "0");
		dto.put("gw", pDto.getAsString("gw"));
		dto.put("jkzrq",
				G4Utils.Date2String(pDto.getAsDate("jkzrq"), "yyyyMMdd"));
		for (int i = 0; i < arrChecked.length; i++) {
			Dto sDto = new BaseDto();
			dto.put("ryid", arrChecked[i]);
			/**
			 * 为兼容联销员重聘入司，需要先删除部门联销员表中的该人员记录
			 */
			Dto iDto = new BaseDto();
			iDto.put("ryid", arrChecked[i]);
			g4Dao.delete("BMLXY.deleteBmlxyByRyID", iDto);
			Integer temp = (Integer) g4Dao.queryForObject(
					"BMLXY.checkBmlxyExists", dto);
			if (temp.intValue() > 0) {
				g4Dao.delete("BMLXY.deleteBmlxyItemByDeptidEmpid", dto);
			}
			dto.put("dqzt", "2");
			
			dto.put("hr_eventid", IDHelper.getHreventID());
			g4Dao.insert("BMLXY.saveLxybmItem", dto);
			g4Dao.insert("LXYBDJL.saveLxybdjlBasicItem", dto);
			g4Dao.update("LXYBMSQB.updateLxybmsqbItem", dto);
		}
		return null;
	}

	public Dto saveLxybdcxItem(Dto pDto) {
		Dto outDto = new BaseDto();
		Integer temp = (Integer) g4Dao
				.queryForObject("LXYBD.checkIsLast", pDto);
		if (temp.intValue() != pDto.getAsInteger("hr_eventid").intValue()) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "撤销失败!!只能撤销该人员的最后一次操作！");
			return outDto;
		}

		pDto.put("bdzt", "1");

		// 撤销入职操作
		if (pDto.getAsString("bdlx").equalsIgnoreCase("1")) {
			pDto.put("dqzt", "1");
			g4Dao.update("LXYBMSQB.updateLxybmsqbItem", pDto);
			g4Dao.delete("BMLXY.deleteBmlxyItem", pDto);
			g4Dao.update("LXYBDJL.updateLxybdjlItem", pDto);
			outDto.put("msg", "联销员入职操作撤销成功！");
			outDto.put("success", new Boolean(true));
		} else if (pDto.getAsString("bdlx").equalsIgnoreCase("5")) {
			pDto.put("dqzt", 2);
			pDto.put("ydrq",
					G4Utils.Date2String(pDto.getAsDate("ydrq"), "yyyyMMdd"));
			pDto.put("jkzrq",
					G4Utils.Date2String(pDto.getAsDate("jkzrq"), "yyyyMMdd"));
			if (!G4Utils.isEmpty(pDto.getAsString("hqxjrq"))) {
				pDto.put("hqxjrq", G4Utils.Date2String(
						pDto.getAsDate("hqxjrq"), "yyyyMMdd"));

			}
			if (!G4Utils.isEmpty(pDto.getAsString("xjjsrq"))) {
				pDto.put("xjjsrq", G4Utils.Date2String(
						pDto.getAsDate("xjjsrq"), "yyyyMMdd"));

			}
			g4Dao.insert("BMLXY.saveLxybmItem", pDto);
			/*
			 * Dto dqztdto = (Dto)
			 * g4Dao.queryForObject("LXYBMSQB.queryLxydelete", pDto); if
			 * (!dqztdto.get("dqzt").equals("5")) {
			 * g4Dao.update("LXYBMSQB.updateLxybmsqbItem", pDto);
			 * System.out.println("当前状态为：" + dqztdto.get("dqzt"));
			 * 
			 * }
			 */
			g4Dao.update("LXYBMSQB.updateLxybmsqbItem", pDto);
			g4Dao.update("LXYBDJL.updateLxybdjlItem", pDto);
			outDto.put("msg", "联销员离职操作撤销成功！");
			outDto.put("success", new Boolean(true));
		} else if (pDto.getAsString("bdlx").equalsIgnoreCase("6")) {
			pDto.put("dqzt", "2");
			/*
			 * SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); String
			 * dd = sdf.format(new Date()); String hqxjrq =
			 * pDto.getAsString("hqxjrq"); if (hqxjrq.isEmpty()) {
			 * System.out.println(dd); pDto.put("hqxjrq", dd);
			 * pDto.put("xjjsrq", dd); }
			 */
			pDto.put("ydrq",
					G4Utils.Date2String(pDto.getAsDate("ydrq"), "yyyyMMdd"));
			pDto.put("jkzrq",
					G4Utils.Date2String(pDto.getAsDate("jkzrq"), "yyyyMMdd"));
			if (!G4Utils.isEmpty(pDto.getAsString("hqxjrq"))) {
				pDto.put("hqxjrq", G4Utils.Date2String(
						pDto.getAsDate("hqxjrq"), "yyyyMMdd"));

			}
			if (!G4Utils.isEmpty(pDto.getAsString("xjjsrq"))) {
				pDto.put("xjjsrq", G4Utils.Date2String(
						pDto.getAsDate("xjjsrq"), "yyyyMMdd"));

			}

			g4Dao.delete("LXYBD.deleteLxyhmd", pDto);
			// g4Dao.update("LXYBD.updateLxyhmd", pDto);
			g4Dao.insert("BMLXY.saveLxybmItem", pDto);
			g4Dao.update("LXYBMSQB.updateLxybmsqbItem", pDto);
			g4Dao.update("LXYBDJL.updateLxybdjlItem", pDto);
			outDto.put("msg", "联销员黑名单操作撤销成功！");
		} else if (pDto.getAsString("bdlx").equalsIgnoreCase("4")) {
			pDto.put("dqzt", 2);

			pDto.put("jkzrq",
					G4Utils.Date2String(pDto.getAsDate("jkzrq"), "yyyyMMdd"));
			if (!G4Utils.isEmpty(pDto.getAsString("hqxjrq"))) {
				pDto.put("hqxjrq", G4Utils.Date2String(
						pDto.getAsDate("hqxjrq"), "yyyyMMdd"));

			}
			if (!G4Utils.isEmpty(pDto.getAsString("xjjsrq"))) {
				pDto.put("xjjsrq", G4Utils.Date2String(
						pDto.getAsDate("xjjsrq"), "yyyyMMdd"));

			}

			g4Dao.update("BMLXY.updateBmlxyItem", pDto);
			g4Dao.update("LXYBDJL.updateLxybdjlItem", pDto);
			outDto.put("msg", "联销员星级操作撤销成功！");
		} else {
			outDto.put("msg", "该业务操作目前还不支持撤销！");
			outDto.put("success", new Boolean(false));
		}
		return outDto;
	}

	/**
	 * 离职
	 */
	public Dto saveLxylzItem(Dto pDto) {

		List<Dto> aList = pDto.getDefaultAList();
		pDto.remove("ghdw");
		for (Dto d : aList) {
			if(d.getAsString("ghdw").equalsIgnoreCase("null")){
				d.remove("ghdw");
			}
			d.put("bz", pDto.getAsString("bz"));
			d.put("bdrq", G4Utils.Date2String(pDto.getAsTimestamp("lzrq"),
					"yyyyMMddHHmmss"));
			d.put("czsj", G4Utils.Date2String(G4Utils.getCurrentTimestamp(),
					"yyyyMMddHHmmss"));
			d.put("czy", pDto.getAsString("czy"));
			d.put("bz2", pDto.getAsString("bz2"));
			d.put("bdzt", "0");
			if (pDto.getAsString("bz").equals("10")) {
				d.put("dqzt", "5");
				d.put("bdlx", "6");
				d.put("yy", "违反企业规定");
				g4Dao.insert("LXYBD.saveLxyhmdWbItem", d);
			} else {
				d.put("dqzt", "4");
				d.put("bdlx", "5");
			}
			if (d.getAsString("xjjsrq").equalsIgnoreCase("null")){
				d.remove("xjjsrq");
			}
			d.put("hr_eventid", IDHelper.getHreventID());
			g4Dao.update("LXYBMSQB.updateLxybmsqbItem", d);
			g4Dao.insert("LXYBDJL.saveLxybdjlBasicItem", d);
			g4Dao.delete("BMLXY.deleteBmlxyItem", d);
		}
		return null;
	}

	public Dto saveLxyHmdItem(Dto pDto) {
		Dto dto = new BaseDto();
		// HR_EVENTID, DEPTID, RYID, BDLX, BDRQ, CZY, CZSJ, BZ,
		// BDZT,GHDW,PP,YGXJ)
		String[] arrchecked = pDto.getAsString("strryid").split(",");
		dto.put("czy", pDto.getAsString("czy"));
		dto.put("czsj", G4Utils.getCurrentTimestamp());
		dto.put("bdrq", G4Utils.getCurrentTimestamp());
		dto.put("yy", pDto.getAsString("yy"));
		dto.put("bdzt", "0");
		dto.put("bdlx", "6");
		dto.put("dqzt", "5");
		for (int i = 0; i < arrchecked.length; i++) {
			dto.put("ryid", arrchecked[i]);
			dto.put("hr_eventid", IDHelper.getHreventID());
			g4Dao.insert("LXYBDJL.saveLxybdjlhmdItem", dto);
			g4Dao.insert("LXYBD.saveLxyhmdWbItem", dto);
			g4Dao.update("LXYBD.updateLxyhmd", dto);

		}

		return null;
	}

	@Override
	public Dto saveLxyjkzItem(Dto pDto) {
		String[] arrChecked = pDto.getAsString("strryid").split(",");
		Dto dto = new BaseDto();
		dto.put("jkzrq",
				G4Utils.Date2String(pDto.getAsDate("jkzrq"), "yyyyMMdd"));
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("ryid", arrChecked[i]);
			g4Dao.update("LXYBD.updateLxyjkz", dto);
		}

		return null;
	}

	@Override
	public Dto updateLxydd(Dto pDto) {
		String[] arrChecked = pDto.getAsString("str_ryid").split(",");
		Dto dto = new BaseDto();
		dto.put("deptid", pDto.getAsString("updatedeptid"));
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("ryid", arrChecked[i]);
			g4Dao.update("LXYBD.updatebmLxydeptid", dto);
			g4Dao.update("LXYBD.updateLxybdjldeptid", dto);
		}
		return null;
	}

	public Dto updateBmlxyItem(Dto pDto) {
		Dto dto = new BaseDto();
		g4Dao.update("BMLXY.updateBmlxyItem", pDto);
		return null;
	}

}
