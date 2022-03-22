export interface Manufacturer extends ManufacturerSubmission{
   Manufacturer_ID: number,
   Manufacturer_slug: string,
   Manufacturer_Relation?: ManufacturerRelation[]
}

export const ManufacturerSubmissionKeys = [
   'Manufacturer_show',
   'Manufacturer_name',
   'Manufacturer_link',
   'Manufacturer_description',
   'Manufacturer_location',
   'Manufacturer_service_organizer',
   'Manufacturer_service_3d',
   'Manufacturer_service_card',
   'Manufacturer_service_bg',
]

export interface ManufacturerSubmission {
   Manufacturer_show: boolean,
   Manufacturer_name: string,
   Manufacturer_link: string,
   Manufacturer_description: string,
   Manufacturer_service_organizer: boolean,
   Manufacturer_service_3d: boolean,
   Manufacturer_service_card: boolean,
   Manufacturer_service_bg: boolean,
}

export const ManufacturerRelation = ['Boardgame']

interface ManufacturerRelation {
   id: number,
   TBG_ID: number,
   Manufacturer_ID: number,
}
