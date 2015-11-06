package com.hr.xl.system.utils;

import org.g4studio.core.id.generator.DefaultIDGenerator;
import org.g4studio.system.common.util.idgenerator.IdGenerator;

public class IDHelper {
	private static DefaultIDGenerator defaultIDGenerator_lxyid = null;
	private static DefaultIDGenerator defaultIDGenerator_hreventid = null;
	private static DefaultIDGenerator defaultIDGenerator_dkjid = null;
	private static DefaultIDGenerator defaultIDGenerator_xid = null;
	private static DefaultIDGenerator defaultIDGenerator_daid = null;
	private static DefaultIDGenerator defaultIDGenerator_oid = null;

	private static DefaultIDGenerator defaultIDGenerator_shiftid = null;
	private static DefaultIDGenerator defaultIDGenerator_shiftGroupId = null;
	private static DefaultIDGenerator defaultIDGenerator_shiftPatternId = null;
	private static DefaultIDGenerator defaultIDGenerator_hCode = null;
	private static DefaultIDGenerator defaultIDGenerator_overCode = null;
	private static DefaultIDGenerator defaultIDGenerator_upfileId = null;
	private static DefaultIDGenerator defaultIDGenerator_roomId = null;
	private static DefaultIDGenerator defaultIDGenerator_dutyId = null;
	
	static {
		IdGenerator idGenerator_lxyid = new IdGenerator();
		idGenerator_lxyid.setFieldname("RYBH");
		defaultIDGenerator_lxyid = idGenerator_lxyid.getDefaultIDGenerator();
	}

	static {
		IdGenerator idGenerator_hreventid = new IdGenerator();
		idGenerator_hreventid.setFieldname("HR_EVENTID");
		defaultIDGenerator_hreventid = idGenerator_hreventid.getDefaultIDGenerator();
	}

	static {
		IdGenerator idGenerator_dkjid = new IdGenerator();
		idGenerator_dkjid.setFieldname("DKJID");
		defaultIDGenerator_dkjid = idGenerator_dkjid.getDefaultIDGenerator();
	}

	static {
		IdGenerator idGenerator_xid = new IdGenerator();
		idGenerator_xid.setFieldname("XID");
		defaultIDGenerator_xid = idGenerator_xid.getDefaultIDGenerator();
	}

	static {
		IdGenerator idGenerator_shiftid = new IdGenerator();
		idGenerator_shiftid.setFieldname("SHIFT_ID");
		defaultIDGenerator_shiftid = idGenerator_shiftid.getDefaultIDGenerator();
	}

	static {
		IdGenerator idGenerator_shiftGroupId = new IdGenerator();
		idGenerator_shiftGroupId.setFieldname("GROUP_ID");
		defaultIDGenerator_shiftGroupId = idGenerator_shiftGroupId.getDefaultIDGenerator();
	}

	static {
		IdGenerator idGenerator_shiftPatternId = new IdGenerator();
		idGenerator_shiftPatternId.setFieldname("PATTERN_ID");
		defaultIDGenerator_shiftPatternId = idGenerator_shiftPatternId.getDefaultIDGenerator();
	}

	static {
		IdGenerator idGenerator_hCode = new IdGenerator();
		idGenerator_hCode.setFieldname("H_CODE");
		defaultIDGenerator_hCode = idGenerator_hCode.getDefaultIDGenerator();
	}

	static {
		IdGenerator idGenerator_overCode = new IdGenerator();
		idGenerator_overCode.setFieldname("OVER_CODE");
		defaultIDGenerator_overCode = idGenerator_overCode.getDefaultIDGenerator();
	}

	static {
		IdGenerator idGenerator_upfileId = new IdGenerator();
		idGenerator_upfileId.setFieldname("UPFILE_ID");
		defaultIDGenerator_upfileId = idGenerator_upfileId.getDefaultIDGenerator();
	}
	
	static {
		IdGenerator idGenerator_roomId = new IdGenerator();
		idGenerator_roomId.setFieldname("ROOM_ID");
		defaultIDGenerator_roomId = idGenerator_roomId.getDefaultIDGenerator();
	}
	
	static {
		IdGenerator idGenerator_dutyId = new IdGenerator();
		idGenerator_dutyId.setFieldname("DUTYID");
		defaultIDGenerator_dutyId = idGenerator_dutyId.getDefaultIDGenerator();
	}
	/*
	 * static { IdGenerator idGenerator_daid = new IdGenerator();
	 * idGenerator_daid.setFieldname("DAID"); defaultIDGenerator_daid =
	 * idGenerator_daid.getDefaultIDGenerator(); }
	 * 
	 * static { IdGenerator idGenerator_oid = new IdGenerator();
	 * idGenerator_oid.setFieldname("OID"); defaultIDGenerator_oid =
	 * idGenerator_oid.getDefaultIDGenerator();
	 * 
	 * }
	 */

	public static String getLxyID() {
		return defaultIDGenerator_lxyid.create();
	}

	public static String getHreventID() {
		return defaultIDGenerator_hreventid.create();
	}

	public static String getDkjid() {
		return defaultIDGenerator_dkjid.create();
	}

	public static String getXID() {
		return defaultIDGenerator_xid.create();
	}

	public static String getDAID() {
		return defaultIDGenerator_daid.create();
	}

	public static String getOID() {
		return defaultIDGenerator_oid.create();
	}

	public static String getShiftId() {
		return defaultIDGenerator_shiftid.create();
	}

	public static String getShiftGroupId() {
		return defaultIDGenerator_shiftGroupId.create();
	}

	public static String getShiftPatternId() {
		return defaultIDGenerator_shiftPatternId.create();
	}

	public static String gethCode() {
		return defaultIDGenerator_hCode.create();
	}

	public static String getOverCode() {
		return defaultIDGenerator_overCode.create();
	}

	public static String getUpfileId() {
		return defaultIDGenerator_upfileId.create();
	}
	
	public static String getRoomId(){
		return defaultIDGenerator_roomId.create();
	} 
	
	public static String getDutyId(){
		return defaultIDGenerator_dutyId.create();
	}
}
