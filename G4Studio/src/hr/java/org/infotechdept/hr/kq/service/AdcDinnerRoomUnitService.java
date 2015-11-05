package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcDinnerRoomUnitService extends BaseService {

	public Dto saveAdcDinnerRoomUnitItem(Dto pDto);
	
	public Dto deleteAdcDinnerRoomUnitItem(Dto pDto);
}
