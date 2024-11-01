import { Module } from '@nestjs/common';
import { UserModel } from './Model/M/User/UserModel';
import { jwtConstants } from './constant';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { GlobalService } from './Service/GlobalService';
import { PrismaService } from './Service/PrismaService';
import { AuthService } from './Service/Auth/AuthService';
import { UserService } from './Service/User/UserService';
import { PermitsModel } from './Model/M/Permits/PermitsModel';
import { PermitsFactory } from './Factory/PermitsFactory';
import { StartFixtures } from './Fixtures/StartFixtures';
import { DefaultController } from './Controller/DefaultController';
import { ConfigCountryModel } from './Model/M/Master/CountryModel';
import { ConfigCityModel } from './Model/M/Master/CityModel';
import { ConfigStateModel } from './Model/M/Master/StateModel';
import { CoinModel } from './Model/M/Master/CoinModel';
import { PaymentMethodModel } from './Model/M/Master/PaymentMethodModel';
import { PaymentMethodService } from './Service/Master/PaymentMethodService';
import { SessionModel } from './Model/M/User/SessionModel';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HistoryEventListener } from './EventListener/HistoryEvent';
import { HistoryModel } from './Model/S/HistoryModel';
import { StaticticsMonthModel } from './Model/S/StaticticsMonthModel';
import { StaticticsYearModel } from './Model/S/StaticticsYearModel';
import { StaticticsForMonthEventListener } from './EventListener/StaticticsForMonthEvent';
import { StaticticsForYearEventListener } from './EventListener/StaticticsForYearEvent';
import { ListenerService } from './Service/ListenerService';
import { ConfigCountryService } from './Service/Master/CountryService';
import { StateService } from './Service/Master/StateService';
import { CityService } from './Service/Master/CityService';
import { CoinService } from './Service/Master/CoinService';
import { LanguajeModel } from './Model/M/Master/LanguajeModel';
import { LanguajeService } from './Service/Translate/LanguajeService';
import { UserApiController } from './Controller/A/UserApiController';
import { CityApiController } from './Controller/A/Master/CityApiController';
import { PaymentMethodApiController } from './Controller/A/Master/PaymentMethodApiController';
import { CountryApiController } from './Controller/A/Master/CountryApiController';
import { StateApiController } from './Controller/A/Master/StateApiController';
import { CoinApiController } from './Controller/A/Master/CoinApiController';
import { SubscriptionApiController } from './Controller/A/Master/SubscriptionApiController';
import { SubscriptionModel } from './Model/M/Master/SubscriptionModel';
import { SubscriptionService } from './Service/Master/SubscriptionService';
import { LoginFactory } from './Factory/AuthFactory/LoginFactory';
import { AuthApiController } from './Controller/A/AuthApiController';
import { AuthApiGuiController } from './Controller/A/GUI/AuthApiGuiController';
import { RegisterFactory } from './Factory/AuthFactory/RegisterFactory';
import { DashboardFactory } from './Factory/DashboardFactory/DashboardFactory';
import { DashboardApiGuiController } from './Controller/A/GUI/DashboardFactory';
import { ProfileApiGuiController } from './Controller/A/GUI/ProfileFactory';
import { UpdateDataApiController } from './Controller/A/GUI/Form/UpdateData';
import { PassowordDataApiController } from './Controller/A/GUI/Form/UpdatePassword';
import { CrudApiController } from './Controller/A/GUI/CRUD/CrudApiController';
import { SelectApiController } from './Controller/A/GUI/Form/SelectField';
import { PermitApiController } from './Controller/A/Master/PermitApiController';
import { PermitService } from './Service/Master/PermitService';
import { HistoryApiController } from './Controller/A/HistoryApiController';
import { HistoryService } from './Service/HistoryService';
import { ValidationService } from './Service/ValidationService';
import { NotificationService } from './Service/User/NotificationService';
import { NotificationModel } from './Model/M/User/NotificationModel';
import { NotificationApiController } from './Controller/A/NotificationApiController';
import { EventFactory } from './Factory/EventFactory';
import { StatisticsApiGuiController } from './Controller/A/GUI/StatisticsApiGuiController';
import { StaticticsService } from './Service/StaticticsService';
import { StaticticsModel } from './Model/S/StaticticsModel';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1d" }
    }),
    EventEmitterModule.forRoot({
      global: true,
      ignoreErrors: true,
      maxListeners: 20
    })
  ],
  controllers: [
    DefaultController,
    UserApiController,
    CoinApiController,
    PaymentMethodApiController,
    CountryApiController,
    StateApiController,
    CityApiController,
    SubscriptionApiController,
    AuthApiController,
    PermitApiController,
    HistoryApiController,
    NotificationApiController,

    // GUI
    AuthApiGuiController,
    DashboardApiGuiController,
    ProfileApiGuiController,
    StatisticsApiGuiController,

    // Forms
    UpdateDataApiController,
    PassowordDataApiController,
    SelectApiController,

    // CRUD
    CrudApiController
  ],
  providers: [
    // globals
    GlobalService,
    PrismaService,
    JwtService,
    ListenerService,

    // models
    UserModel,
    PermitsModel,
    ConfigCountryModel,
    ConfigCityModel,
    ConfigStateModel,
    CoinModel,
    PaymentMethodModel,
    SessionModel,
    LanguajeModel,
    SubscriptionModel,
    NotificationModel,
    StaticticsModel,

    // history
    HistoryModel,

    // statictics
    StaticticsMonthModel,
    StaticticsYearModel,

    // services
    AuthService,
    UserService,
    StartFixtures,
    PaymentMethodService,
    ConfigCountryService,
    StateService,
    CityService,
    CoinService,
    PaymentMethodService,
    LanguajeService,
    SubscriptionService,
    PermitService,
    HistoryService,
    ValidationService,
    NotificationService,
    StaticticsService,

    // Factory
    PermitsFactory,
    LoginFactory,
    RegisterFactory,
    DashboardFactory,
    EventFactory,

    // listener
    HistoryEventListener,
    StaticticsForMonthEventListener,
    StaticticsForYearEventListener
  ],
})
export class AppModule {}
