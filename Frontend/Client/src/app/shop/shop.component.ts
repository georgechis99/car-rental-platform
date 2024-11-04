import { ShopService } from './shop.service';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Vehicle } from '../shared/models/vehicle';
import { VehicleBrand } from '../shared/models/vehicle-brand';
import { VehicleModel } from '../shared/models/vehicle-model';
import { VehicleParams } from '../shared/models/vehicle-params';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IPriceRange,
  IPriceRangeForCheckboxFilter,
} from '../shared/models/price-range';
import { IOptionForCheckboxFilter } from '../shared/models/option-for-filter-checkbox';
import {
  ICategory,
  ICategoryForCheckboxFilter,
} from '../shared/models/vehicle-category';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef;
  vehicles: Vehicle[] = [];
  totalCount = 0;
  brands: VehicleBrand[] = [];
  models: VehicleModel[] = [];
  vehicleParams = new VehicleParams();
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Lowest First', value: 'priceAsc' },
    { name: 'Price: Highest First', value: 'priceDesc' },
  ];
  //Need to change them being Hardcoded!!! (Need to implemnet a service method for them)
  priceRanges: IPriceRangeForCheckboxFilter[] = [];
  //Need to change them being Hardcoded!!! (Need to implemnet a service method for them)
  categories: ICategoryForCheckboxFilter[] = [];
  //Need to change them being Hardcoded!!! (Need to implemnet a service method for them)
  transmisionTypes: IOptionForCheckboxFilter[] = [
    { name: 'Manual', isChecked: false },
    { name: 'Automatic', isChecked: false },
  ];
  loadingMore = false;

  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBrands();
    this.getModels();
    this.getVehicleCategories();
    this.getVehiclePriceRanges();
    this.getVehiclesForQueryParams();
  }

  getVehicleCategories() {
    var arrayOfCategories;
    this.shopService.getVehicleCategories().subscribe({
      next: (response) => {
        arrayOfCategories = response;
        this.categories = arrayOfCategories.map((category) => {
          return {
            id: category.id,
            name: category.name,
            isChecked: false,
            pictureUrl: category.pictureUrl,
          };

        });
      },
      error: (error) => console.log(error),
    });
  }

  getVehiclePriceRanges() {
    var arrayOfPriceRanges;
    this.shopService.getVehiclePriceRanges().subscribe({
      next: (response) => {
        arrayOfPriceRanges = response;
        this.priceRanges = arrayOfPriceRanges.map((priceRange: IPriceRange) => {
          return {
            lowValue: priceRange.lowValue,
            highValue: priceRange.highValue,
            isChecked: false,
            label:
              priceRange.lowValue +
              (priceRange.highValue != priceRange.lowValue
                ? ' - ' + priceRange.highValue + ' €'
                : '+' + ' €'),
          };
        });
      },
      error: (error) => console.log(error),
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const pos = window.innerHeight + window.scrollY;
    const max = document.documentElement.scrollHeight;

    if (pos >= max - 500 && !this.loadingMore) {
      this.loadMore();
    }
  }

  getVehiclesForQueryParams(reload?: boolean) {
    if(reload){
      this.vehicleParams.pageNumber = 1;
    }

    if (
      this.route.snapshot.queryParams['pickupDate'] &&
      this.route.snapshot.queryParams['dropoffDate'] &&
      this.route.snapshot.queryParams['pickupLocationId'] &&
      this.route.snapshot.queryParams['dropoffLocationId'] &&
      this.route.snapshot.queryParams['dropoffLocationName'] &&
      this.route.snapshot.queryParams['pickupLocationName']
    ) {
      this.vehicleParams.pickupDate = new Date(
        this.route.snapshot.queryParams['pickupDate']
      );
      this.vehicleParams.dropoffDate = new Date(
        this.route.snapshot.queryParams['dropoffDate']
      );

      this.vehicleParams.pickupLocationId =
        this.route.snapshot.queryParams['pickupLocationId'];
      this.vehicleParams.dropoffLocationId =
        this.route.snapshot.queryParams['dropoffLocationId'];
      this.vehicleParams.pickupLocationName =
        this.route.snapshot.queryParams['pickupLocationName'];
      this.vehicleParams.dropoffLocationName =
        this.route.snapshot.queryParams['dropoffLocationName'];

      this.getVehicles();
    } else {
      this.getVehicles();
    }
  }

  getVehicles() {
    if (this.vehicleParams.pageNumber === 1) {
      this.vehicles = [];
    }

    this.loadingMore = true;

    this.shopService.getVehicles(this.vehicleParams).subscribe({
      next: (response) => {
        this.vehicles = this.vehicles
          ? this.vehicles.concat(response.data)
          : response.data;
        this.vehicleParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        this.loadingMore = false;
      },
      error: (error) => console.log(error),
    });
  }

  loadMore() {
    if (this.vehicles.length < this.totalCount) {
      this.vehicleParams.pageNumber = this.vehicleParams.pageNumber + 1;
      this.getVehicles();
    }
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: (response) => (this.brands = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }

  getModels() {
    this.shopService.getModels().subscribe({
      next: (response) => (this.models = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }

  getModelsByBrand() {
    this.shopService.getModelsByBrand(this.vehicleParams.brandId).subscribe({
      next: (response) => (this.models = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }

  onBrandSelected(event: any) {
    this.vehicleParams.pageNumber = 1;
    this.vehicleParams.brandId = event.target.value;
    this.vehicleParams.modelId = 0;
    this.getVehicles();
    this.getModelsByBrand();
  }

  onModelSelected(event: any) {
    this.vehicleParams.pageNumber = 1;
    this.vehicleParams.modelId = event.target.value;
    this.getVehicles();
  }

  onCategorySelected(event: any) {
    this.vehicleParams.pageNumber = 1;
    this.vehicleParams.categories = this.categories
      .filter((category) => category.isChecked)
      .map<ICategory>((category) => {
        return {
          id: category.id,
          name: category.name,
          pictureUrl: category.pictureUrl,
        };
      });
    this.getVehicles();
  }

  onPriceRangeSelected(event: any) {
    this.vehicleParams.pageNumber = 1;
    this.vehicleParams.priceRanges = this.priceRanges
      .filter((priceRange) => priceRange.isChecked)
      .map<IPriceRange>((priceRange) => {
        return {
          lowValue: priceRange.lowValue,
          highValue: priceRange.highValue,
        };
      });
    this.getVehicles();
  }

  onTransmissionTypeSelected(event: any) {
    this.vehicleParams.pageNumber = 1;
    this.vehicleParams.transmissionTypes = this.transmisionTypes
      .filter((transmissionType) => transmissionType.isChecked)
      .map<string>((transmissionType) => {
        return transmissionType.name;
      });
    this.getVehicles();
  }

  onSortSelected(event: any) {
    this.vehicleParams.pageNumber = 1;
    this.vehicleParams.sort = event.target.value;
    this.getVehicles();
  }

  onSearch() {
    this.vehicleParams.pageNumber = 1;
    this.vehicleParams.search = this.searchTerm?.nativeElement.value;
    this.getVehicles();
  }

  onReset() {
    this.vehicleParams.brandId = 0;
    this.vehicleParams.modelId = 0;
    this.vehicleParams.pageNumber = 1;
    this.vehicleParams.pageSize = 6;
    this.vehicleParams.sort = 'name';
    this.vehicleParams.priceRanges = [];
    this.vehicleParams.categories = [];
    this.vehicleParams.transmissionTypes = [];

    this.setPriceRangesFalse();
    this.setCategoriesFalse();
    this.setTransmissionTypesFalse();

    this.resetSortOptions();
    this.getVehicles();

  }

  setTransmissionTypesFalse() {
    this.transmisionTypes.forEach(transmissionType=>transmissionType.isChecked=false);
  }

  setCategoriesFalse() {
    this.categories.forEach(category=>category.isChecked=false);
  }

  setPriceRangesFalse() {
    this.priceRanges.forEach(priceRange=>priceRange.isChecked=false);
  }

  resetSortOptions() {
    //Need to reset the sort options so that the dropdown gets updated and reset.
    this.sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Lowest First', value: 'priceAsc' },
    { name: 'Price: Highest First', value: 'priceDesc' },
  ];
  }

  calculateDays(startDate: Date, endDate: Date): number {
    const start = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    // Check if the end date hour is more than 4 hours after the start date hour
    if (endDate.getHours() - startDate.getHours() >= 4) {
      // Add one more day to the result
      end.setDate(end.getDate() + 1);
    }

    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return days;
  }

  resetFilterClicked() {

  }
}
