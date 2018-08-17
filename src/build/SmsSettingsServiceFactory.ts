import { Factory } from 'pip-services-components-node';
import { Descriptor } from 'pip-services-commons-node';

import { SmsSettingsMongoDbPersistence } from '../persistence/SmsSettingsMongoDbPersistence';
import { SmsSettingsFilePersistence } from '../persistence/SmsSettingsFilePersistence';
import { SmsSettingsMemoryPersistence } from '../persistence/SmsSettingsMemoryPersistence';
import { SmsSettingsController } from '../logic/SmsSettingsController';
import { SmsSettingsHttpServiceV1 } from '../services/version1/SmsSettingsHttpServiceV1';
import { SmsSettingsSenecaServiceV1 } from '../services/version1/SmsSettingsSenecaServiceV1'; 

export class SmsSettingsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-smssettings", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-smssettings", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("pip-services-smssettings", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-smssettings", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-smssettings", "controller", "default", "*", "1.0");
	public static SenecaServiceDescriptor = new Descriptor("pip-services-smssettings", "service", "seneca", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-smssettings", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(SmsSettingsServiceFactory.MemoryPersistenceDescriptor, SmsSettingsMemoryPersistence);
		this.registerAsType(SmsSettingsServiceFactory.FilePersistenceDescriptor, SmsSettingsFilePersistence);
		this.registerAsType(SmsSettingsServiceFactory.MongoDbPersistenceDescriptor, SmsSettingsMongoDbPersistence);
		this.registerAsType(SmsSettingsServiceFactory.ControllerDescriptor, SmsSettingsController);
		this.registerAsType(SmsSettingsServiceFactory.SenecaServiceDescriptor, SmsSettingsSenecaServiceV1);
		this.registerAsType(SmsSettingsServiceFactory.HttpServiceDescriptor, SmsSettingsHttpServiceV1);
	}
	
}
