package org.infotechdept.hr.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.infotechdept.hr.kq.service.AdcShiftGroupService;

import com.hr.xl.system.utils.IDHelper;

public class AdcShiftGroupServiceImpl extends BaseServiceImpl implements AdcShiftGroupService {

	public Dto saveAdcShiftGroupItem(Dto pDto) {
		String gid = IDHelper.getShiftGroupId();
		pDto.put("group_id", gid);
		g4Dao.insert("AdcShiftGroup.saveAdcShiftGroupItem", pDto);
		return null;
	}

	public Dto updateAdcShiftGroupItem(Dto pDto) {
		g4Dao.update("AdcShiftGroup.updateAdcShiftGroupItem", pDto);
		return null;
	}

	public Dto deleteAdcShiftGroupItem(Dto pDto) {
		Dto outDto = new BaseDto();
		Dto dto = new BaseDto();
		String errId = null;
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("group_id", arrChecked[i]);
			Integer temp = (Integer) g4Dao.queryForObject("AdcShiftGroup.checkAdcShiftGroupInUsesd", dto);
			if (temp.intValue() == 0) {
				g4Dao.delete("AdcShiftGroup.deleteAdcShiftGroupEmplByGroupId", dto);
				g4Dao.delete("AdcShiftGroup.deleteAdcShiftGroupItem", dto);
			} else {
				errId += "[" + arrChecked[i] + "]";
			}
		}
		outDto.put("success", new Boolean(true));
		if (errId == null) {
			outDto.put("msg", "全部数据删除成功！");
		} else {
			outDto.put("msg", "下列数据无法删除：" + errId);
		}
		return outDto;

	}

	public Dto saveAdcShiftGroupEmplItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		String groupId = pDto.getAsString("group_id");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("empid", arrChecked[i]);
			dto.put("group_id", groupId);
			g4Dao.insert("AdcShiftGroup.saveAdcShiftGroupEmplItem", dto);
		}
		return null;
	}

	public Dto deleteAdcShiftGroupEmplItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("oid", arrChecked[i]);
			g4Dao.delete("AdcShiftGroup.deleteAdcShiftGroupEmplItem", dto);
		}
		return null;
	}

}
