package org.infotechdept.hr.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;
import org.infotechdept.hr.kq.service.AdcShiftApplyService;

public class AdcShiftApplyServiceImpl extends BaseServiceImpl implements AdcShiftApplyService {

	public Dto saveAdcShiftApplyItem(Dto pDto) {

		if (G4Utils.isNotEmpty(pDto.getAsString("empid"))) {
			pDto.remove("group_id");
			pDto.put("record_type", "3");
			pDto.put("priority", 40);
		} else if (G4Utils.isNotEmpty(pDto.getAsString("group_id"))) {
			pDto.remove("empid");
			pDto.put("record_type", "2");
			pDto.put("priority", 30);
		} else {
			pDto.remove("group_id");
			pDto.remove("empid");
			pDto.put("record_type", "1");
			pDto.put("priority", pDto.getAsString("deptid").length());
		}
		Dto dto = new BaseDto();
		dto.put("code", pDto.getAsString("record_type"));
		String sortno = (String) g4Dao.queryForObject("AdcShiftApply.getCodeSortno", dto);

		g4Dao.insert("AdcShiftApply.saveAdcShiftApplyItem", pDto);
		return null;
	}

	public Dto updateAdcShiftApplyItem(Dto pDto) {
		g4Dao.update("AdcShiftApply.updateAdcShiftApply", pDto);
		return null;
	}

	/**
	 * 删除班次应用（删除班次应用时应一并删除班次初始化数据）
	 */
	public Dto deleteAdcShiftApplyItem(Dto pDto) {
		int j = 0;
		String notDel = null;
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("apply_id", arrChecked[i]);
			g4Dao.delete("AdcShiftRecord.deleteAdcShiftRecordByApplyId", dto);
			g4Dao.delete("AdcShiftApply.deleteAdcShiftApplyItems", dto);
		}
		Dto outDto = new BaseDto();
		outDto.put("success", new Boolean(true));
		if (j > 0) {
			outDto.put("msg", "下列班次应用由于已经排班，无法删除。" + notDel);
		} else {
			outDto.put("msg", "全部删除成功！");
		}
		return outDto;
	}

}
