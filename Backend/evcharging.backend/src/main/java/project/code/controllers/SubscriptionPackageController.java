package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.SubscriptionPackage;
import project.code.model.enums.SubscriptionType;
import project.code.services.SubscriptionPackageService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subscription-packages")
@RequiredArgsConstructor
public class SubscriptionPackageController {

    private final SubscriptionPackageService subscriptionPackageService;

    // Lấy tất cả packages
    @GetMapping
    public ResponseEntity<List<SubscriptionPackage>> getAllPackages() {
        return ResponseEntity.ok(subscriptionPackageService.getAllPackages());
    }

    // Lấy package theo ID
    @GetMapping("/{packageId}")
    public ResponseEntity<?> getPackageById(@PathVariable String packageId) {
        Optional<SubscriptionPackage> pkg = subscriptionPackageService.getPackageById(packageId);
        return pkg.isPresent()
                ? ResponseEntity.ok(pkg.get())
                : ResponseEntity.status(404).body("Không tìm thấy subscription package với ID: " + packageId);
    }

    // Tạo mới package
    @PostMapping
    public ResponseEntity<SubscriptionPackage> createPackage(@RequestBody SubscriptionPackage subscriptionPackage) {
        return ResponseEntity.status(201).body(subscriptionPackageService.createPackage(subscriptionPackage));
    }

    // Cập nhật package
    @PutMapping("/{packageId}")
    public ResponseEntity<?> updatePackage(@PathVariable String packageId, @RequestBody SubscriptionPackage subscriptionPackage) {
        try {
            SubscriptionPackage updated = subscriptionPackageService.updatePackage(packageId, subscriptionPackage);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Không tìm thấy package để cập nhật");
        }
    }

    // Xóa package
    @DeleteMapping("/{packageId}")
    public ResponseEntity<String> deletePackage(@PathVariable String packageId) {
        boolean deleted = subscriptionPackageService.deletePackage(packageId);
        return deleted
                ? ResponseEntity.ok("Đã xóa subscription package thành công")
                : ResponseEntity.status(404).body("Không tìm thấy package để xóa");
    }

    // Tìm package theo tên chính xác
    @GetMapping("/name/{name}")
    public ResponseEntity<?> getPackageByName(@PathVariable String name) {
        Optional<SubscriptionPackage> pkg = subscriptionPackageService.getPackageByName(name);
        return pkg.isPresent()
                ? ResponseEntity.ok(pkg.get())
                : ResponseEntity.status(404).body("Không tìm thấy package với tên: " + name);
    }

    // Tìm packages theo từ khóa trong tên
    @GetMapping("/search")
    public ResponseEntity<List<SubscriptionPackage>> searchPackagesByName(@RequestParam String keyword) {
        return ResponseEntity.ok(subscriptionPackageService.searchPackagesByName(keyword));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<SubscriptionPackage>> getPackagesByType(@PathVariable SubscriptionType type) {
        return ResponseEntity.ok(subscriptionPackageService.getPackagesByType(type));
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<SubscriptionPackage>> getPackagesByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        return ResponseEntity.ok(subscriptionPackageService.getPackagesByPriceRange(minPrice, maxPrice));
    }

    @GetMapping("/min-price/{minPrice}")
    public ResponseEntity<List<SubscriptionPackage>> getPackagesWithMinPrice(@PathVariable Double minPrice) {
        return ResponseEntity.ok(subscriptionPackageService.getPackagesWithMinPrice(minPrice));
    }

    @GetMapping("/max-price/{maxPrice}")
    public ResponseEntity<List<SubscriptionPackage>> getPackagesWithMaxPrice(@PathVariable Double maxPrice) {
        return ResponseEntity.ok(subscriptionPackageService.getPackagesWithMaxPrice(maxPrice));
    }

    @GetMapping("/duration/{durationDays}")
    public ResponseEntity<List<SubscriptionPackage>> getPackagesByDuration(@PathVariable int durationDays) {
        return ResponseEntity.ok(subscriptionPackageService.getPackagesByDuration(durationDays));
    }

    @GetMapping("/min-duration/{minDays}")
    public ResponseEntity<List<SubscriptionPackage>> getPackagesWithMinDuration(@PathVariable int minDays) {
        return ResponseEntity.ok(subscriptionPackageService.getPackagesWithMinDuration(minDays));
    }

    @GetMapping("/search-description")
    public ResponseEntity<List<SubscriptionPackage>> searchPackagesByDescription(@RequestParam String keyword) {
        return ResponseEntity.ok(subscriptionPackageService.searchPackagesByDescription(keyword));
    }

    @GetMapping("/sorted/price-asc")
    public ResponseEntity<List<SubscriptionPackage>> getAllPackagesSortedByPriceAsc() {
        return ResponseEntity.ok(subscriptionPackageService.getAllPackagesSortedByPriceAsc());
    }

    @GetMapping("/sorted/price-desc")
    public ResponseEntity<List<SubscriptionPackage>> getAllPackagesSortedByPriceDesc() {
        return ResponseEntity.ok(subscriptionPackageService.getAllPackagesSortedByPriceDesc());
    }

    @GetMapping("/sorted/duration")
    public ResponseEntity<List<SubscriptionPackage>> getAllPackagesSortedByDuration() {
        return ResponseEntity.ok(subscriptionPackageService.getAllPackagesSortedByDuration());
    }

    @GetMapping("/type/{type}/sorted")
    public ResponseEntity<List<SubscriptionPackage>> getPackagesByTypeSorted(@PathVariable SubscriptionType type) {
        return ResponseEntity.ok(subscriptionPackageService.getPackagesByTypeSorted(type));
    }
}