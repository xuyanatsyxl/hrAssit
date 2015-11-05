package com.hr.xl.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;

import com.hr.xl.kq.service.DkjService;
import com.hr.xl.system.utils.IDHelper;

public class DkjServiceImpl extends BaseServiceImpl implements DkjService {

	public Dto saveDkjlbItem(Dto pDto) {
		// TODO Auto-generated method stub
		Dto outDto = new BaseDto();
		Integer temp = (Integer) g4Dao.queryForObject("DKJLB.checkIpExits", pDto);
		if (temp.intValue() != 0) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "IP地址重复！");
			return outDto;
		}
		temp = (Integer) g4Dao.queryForObject("DKJLB.checkDevsnExists", pDto);
		if (temp.intValue() != 0) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "设备号重复！");
			return outDto;
		}
		pDto.put("dkjid", IDHelper.getDkjid());
		g4Dao.insert("DKJLB.saveDkjlbItem", pDto);
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "打卡机新增成功！");
		return outDto;
	}

	public Dto deleteDkjlbItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("dkjid", arrChecked[i]);
			g4Dao.delete("DKJLB.deleteDkjlbItem", dto);
		}
		return null;
	}

	public Dto updateDkjlbItem(Dto pDto) {
		Dto outDto = new BaseDto();
		g4Dao.update("DKJLB.updateDkjlbItem", pDto);
		return null;
	}

}
