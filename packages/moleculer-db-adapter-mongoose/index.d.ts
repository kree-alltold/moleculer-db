declare module "moleculer-db-adapter-mongoose" {
	import { Service, ServiceBroker } from "moleculer";
	import {
		ConnectOptions ,
		Document,
		Query as DocumentQuery, //reff: https://github.com/Automattic/mongoose/issues/10036#issuecomment-803144616
		Model,
		Schema,
	} from "mongoose";
	import { Db } from "mongodb";

	type HasModelOrSchema<T extends object> =
		| {
				model: Model<T>;
		  }
		| {
				schema: Schema;
				modelName: string;
		  };

	/**
	 * Parameters to {@link MongooseDbAdapter.count}
	 */
	interface CountFilters {
		query?: any;
		search?: string;
		searchFields?: string[]; // never used?
	}



	/**
	 * Parameters to {@link MongooseDbAdapter.createCursor}
	 */
	interface FindFilters {
		query?: any;
		search?: string;
		searchFields?: string[]; // never used???
		sort?: string | string[];
		offset?: number;
		limit?: number;
	}

	class MongooseDbAdapter<T extends object> {
		uri: string;
		opts?: ConnectOptions;
		broker: ServiceBroker;
		service: Service;
		model: Model<T>;
		schema?: Schema;
		modelName?: string;
		db: Db;

		/**
		 * Creates an instance of MongooseDbAdapter.
		 */
		constructor(uri: string, opts?: ConnectOptions);
		/**
		 * Initialize adapter
		 */
		init(
			broker: ServiceBroker,
			service: Service & HasModelOrSchema<T>
		): void;
		/**
		 * Connect to database
		 */
		connect(): Promise<void>;
		/**
		 * Disconnect from database
		 */
		disconnect(): Promise<void>;
		/**
		 * Find all entities by filters.
		 *
		 * Available filter props:
		 * 	- limit
		 *  - offset
		 *  - sort
		 *  - search
		 *  - searchFields
		 *  - query
		 */
		find(filters: FindFilters): Promise<T[]>;
		/**
		 * Find an entity by query
		 */
		findOne(query: any): Promise<T>;
		/**
		 * Find an entities by ID
		 */
		findById(_id: any): Promise<T>;
		/**
		 * Find any entities by IDs
		 */
		findByIds(idList: any[]): Promise<T[]>;
		/**
		 * Get count of filtered entites
		 *
		 * Available filter props:
		 *  - search
		 *  - searchFields
		 *  - query
		 */
		count(filters?: CountFilters): Promise<number>;
		/**
		 * Insert an entity
		 */
		insert(entity: any): Promise<T>;
		/**
		 * Insert many entities
		 */
		insertMany(entities: any[]): Promise<T[]>;
		/**
		 * Update many entities by `query` and `update`
		 */
		updateMany(query: any, update: any): Promise<number>;
		/**
		 * Update an entity by ID and `update`
		 */
		updateById(
			_id: any,
			update: any
		): Promise<DocumentQuery<T | null, T>>;
		/**
		 * Remove entities which are matched by `query`
		 */
		removeMany(query: any): Promise<number>;
		/**
		 * Remove an entity by ID
		 */
		removeById(_id: any): Promise<DocumentQuery<T | null, T>>;
		/**
		 * Clear all entities from collection
		 */
		clear(): Promise<void>;
		/**
		 * Convert DB entity to JSON object
		 */
		entityToObject(entity: any): object;
		/**
		 * Create a filtered query
		 * Available filters in `params`:
		 *  - search
		 * 	- sort
		 * 	- limit
		 * 	- offset
		 *  - query
		 */
		createCursor(
			params: FindFilters
		): DocumentQuery<T[], T>;

		/**
		 * Transforms 'idField' into MongoDB's '_id'
		 */
		beforeSaveTransformID(entity: object, idField: string): object;

		/**
		 * Transforms MongoDB's '_id' into user defined 'idField'
		 */
		afterRetrieveTransformID(entity: object, idField: string): object;
	}
	export = MongooseDbAdapter;
}
