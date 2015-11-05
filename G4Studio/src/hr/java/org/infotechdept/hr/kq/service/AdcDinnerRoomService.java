package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcDinnerRoomService extends BaseService {

	public Dto saveAdcDinnerRoomItem(Dto pDto);
	
	public Dto updateAdcDinnerRoomItem(Dto pDto);
	
	public Dto deleteAdcDinnerRoomItem(Dto pDto);
	
	public Dto saveAdcDinnerRoomDkjItem(Dto pDto);
	
	public Dto updateAdcDinnerRoomDkjItem(Dto pDto);
	
	public Dto deleteAdcDinnerRoomDkjItem(Dto pDto);
	
	public Dto saveDinnerRoom(Dto pDto);
	
}
