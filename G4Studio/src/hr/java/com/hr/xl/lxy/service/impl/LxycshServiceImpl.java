package com.hr.xl.lxy.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;

import com.hr.xl.lxy.service.LxycshService;
import com.hr.xl.system.utils.IDHelper;

public class LxycshServiceImpl extends BaseServiceImpl implements LxycshService {

	@Override
	public Dto deletelxyxjwh(Dto pDto) {
		String[] eventid = pDto.getAsString("strchecked").split(",");
		Dto outDto = new BaseDto();
		for (int i = 0; i < eventid.length; i++) {
			Dto dto = new BaseDto();
			dto.put("hr_eventid", eventid[i]);
			g4Dao.delete("LXYBDJL.deleteLxybdjlItem", dto);
		}
		outDto.put("msg", "删除成功!");
		outDto.put("success", new Boolean(true));
		return outDto;
	}

	@Override
	public Dto savelxyxjwhItem(Dto pDto) {
		Dto outDto = new BaseDto();
		pDto.put("czsj", pDto.getAsString("czsj"));

		pDto.put("ygxj", pDto.getAsString("xygxj"));
		pDto.put("bdlx", "4");
		pDto.put("bdzt", "0");
		pDto.put("hqxjrq", pDto.getAsString("xhqxjrq"));
		System.out.println(pDto.get("ryid") + ":ryid");
		String hr_eventid = pDto.getAsString("hr_eventid");
		if (hr_eventid.isEmpty()) {
			pDto.put("hr_eventid", IDHelper.getHreventID());
			g4Dao.insert("LXYBDJL.saveLxybdjlItem", pDto);
			outDto.put("msg", "添加成功!");
			outDto.put("success", new Boolean(true));
		} else {
			g4Dao.update("LXYBDJL.updateLxybdjlItem", pDto);
			outDto.put("msg", "修改成功!");
			outDto.put("success", new Boolean(true));
		}
		return outDto;
	}

}
