package project.code.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.SubscriptionPackage;
import project.code.repository.SubscriptionPackageRepository;

import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionPackageService {

    @Autowired
    private SubscriptionPackageRepository subscriptionPackageRepository;

    // Lấy tất cả subscription packages
    public List<SubscriptionPackage> getAllPackages() {
        return subscriptionPackageRepository.findAll();
    }

    // Lấy package theo ID
    public Optional<SubscriptionPackage> getPackageById(String packageId) {
        return subscriptionPackageRepository.findById(packageId);
    }

    // Tạo mới package
    public SubscriptionPackage createPackage(SubscriptionPackage subscriptionPackage) {
        subscriptionPackage.createPackage();
        return subscriptionPackageRepository.save(subscriptionPackage);
    }

    // Cập nhật package
    public SubscriptionPackage updatePackage(String packageId, SubscriptionPackage updatedPackage) {
        return subscriptionPackageRepository.findById(packageId)
                .map(pkg -> {
                    pkg.setName(updatedPackage.getName());
                    pkg.setDescription(updatedPackage.getDescription());
                    pkg.setPrice(updatedPackage.getPrice());
                    pkg.setDurationDays(updatedPackage.getDurationDays());
                    pkg.setBenefits(updatedPackage.getBenefits());
                    pkg.setType(updatedPackage.getType());
                    pkg.updatePackage();
                    return subscriptionPackageRepository.save(pkg);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SubscriptionPackage ID: " + packageId));
    }

    // Xóa package
    public boolean deletePackage(String packageId) {
        if (subscriptionPackageRepository.existsById(packageId)) {
            Optional<SubscriptionPackage> pkg = subscriptionPackageRepository.findById(packageId);
            if (pkg.isPresent()) {
                pkg.get().deletePackage();
            }
            subscriptionPackageRepository.deleteById(packageId);
            return true;
        }
        return false;
    }

    // Tìm package theo tên
    public Optional<SubscriptionPackage> getPackageByName(String name) {
        return subscriptionPackageRepository.findByName(name);
    }

    // Tìm packages theo từ khóa trong tên
    public List<SubscriptionPackage> searchPackagesByName(String keyword) {
        return subscriptionPackageRepository.findByNameContainingIgnoreCase(keyword);
    }

    // Lấy packages theo loại (type)
    public List<SubscriptionPackage> getPackagesByType(String type) {
        return subscriptionPackageRepository.findByType(type);
    }

    // Lấy packages theo khoảng giá
    public List<SubscriptionPackage> getPackagesByPriceRange(Double minPrice, Double maxPrice) {
        return subscriptionPackageRepository.findByPriceBetween(minPrice, maxPrice);
    }

    // Lấy packages có giá >= minPrice
    public List<SubscriptionPackage> getPackagesWithMinPrice(Double minPrice) {
        return subscriptionPackageRepository.findByPriceGreaterThanEqual(minPrice);
    }

    // Lấy packages có giá <= maxPrice
    public List<SubscriptionPackage> getPackagesWithMaxPrice(Double maxPrice) {
        return subscriptionPackageRepository.findByPriceLessThanEqual(maxPrice);
    }

    // Lấy packages theo số ngày hiệu lực
    public List<SubscriptionPackage> getPackagesByDuration(int durationDays) {
        return subscriptionPackageRepository.findByDurationDays(durationDays);
    }

    // Lấy packages có duration >= minDays
    public List<SubscriptionPackage> getPackagesWithMinDuration(int minDays) {
        return subscriptionPackageRepository.findByDurationDaysGreaterThanEqual(minDays);
    }

    // Tìm packages theo từ khóa trong mô tả
    public List<SubscriptionPackage> searchPackagesByDescription(String keyword) {
        return subscriptionPackageRepository.findByDescriptionContainingIgnoreCase(keyword);
    }

    // Lấy tất cả packages sắp xếp theo giá tăng dần
    public List<SubscriptionPackage> getAllPackagesSortedByPriceAsc() {
        return subscriptionPackageRepository.findAllByOrderByPriceAsc();
    }

    // Lấy tất cả packages sắp xếp theo giá giảm dần
    public List<SubscriptionPackage> getAllPackagesSortedByPriceDesc() {
        return subscriptionPackageRepository.findAllByOrderByPriceDesc();
    }

    // Lấy tất cả packages sắp xếp theo duration tăng dần
    public List<SubscriptionPackage> getAllPackagesSortedByDuration() {
        return subscriptionPackageRepository.findAllByOrderByDurationDaysAsc();
    }

    // Lấy packages theo type và sắp xếp theo giá
    public List<SubscriptionPackage> getPackagesByTypeSorted(String type) {
        return subscriptionPackageRepository.findByTypeOrderByPriceAsc(type);
    }

    // Kích hoạt package cho user
    public void activatePackageForUser(String packageId, String userId) {
        SubscriptionPackage pkg = subscriptionPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SubscriptionPackage ID: " + packageId));
        pkg.activateForUser(userId);
    }

    // Hủy package cho user
    public void cancelPackageForUser(String packageId, String userId) {
        SubscriptionPackage pkg = subscriptionPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SubscriptionPackage ID: " + packageId));
        pkg.cancelForUser(userId);
    }
}